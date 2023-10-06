using API.DTOs;
using API.Entities;
using API.Extentions;
using API.Helpers;
using API.interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;
[Authorize]
public class UsersController : BaseApiController
{
    private readonly IPhotoService _photoService;
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
    {
        _userRepository = userRepository;
        _mapper = mapper;
        _photoService = photoService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedList<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
    //public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
    {
        // var users = await _userRepository.GetUsersAsync();
        // var usersToReturn = _mapper.Map<IEnumerable<MemberDto>>(users);
        var CurrentUser = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
        userParams.CurrentUsername = CurrentUser.UserName;
        if (string.IsNullOrEmpty(userParams.Gender))
        {
            userParams.Gender = CurrentUser.Gender == "male" ? "female" : "male";
        }

        var users = await _userRepository.GetMembersAsync(userParams);
        Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages));
        return Ok(users);
    }

    [HttpGet("{username}")]
    public async Task<ActionResult<MemberDto>> GetUser(string username)
    {
        //this solution also works but read all data columns from both sql tables.
        //automapper is used to refine the columns we need to provide to API output.

        // var user= await _userRepository.GetUserByUsernameAsync(username);
        // return _mapper.Map<MemberDto>(user);

        //this method will return only required columns using automapper nuget package.
        return await _userRepository.GetMemberAsync(username);

    }
    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
    {
        var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

        if (user == null) return NotFound();

        _mapper.Map(memberUpdateDto, user);

        if (await _userRepository.SaveAllAsync()) return NoContent();

        return BadRequest("Failed to update user!");

    }
    [HttpPost("add-photo")]
    public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
    {
        var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

        if (user == null) return NotFound();

        var result = await _photoService.AddPhotoAsync(file);

        if (result.Error != null) return BadRequest(result.Error.Message);

        var photo = new Photo
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId
        };

        if (user.Photos.Count == 0) photo.IsMain = true;
        user.Photos.Add(photo);
        if (await _userRepository.SaveAllAsync())
        {
            return CreatedAtAction(nameof(GetUser), new { username = user.UserName }, _mapper.Map<PhotoDto>(photo));
        }

        return BadRequest("Problem adding photo");

    }

    [HttpPut("set-main-photo/{photoId}")]
    public async Task<ActionResult> SetMainPhoto(int photoId)
    {
        var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return NotFound();

        var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
        if (photo == null) return NotFound();

        if (photo.IsMain) return BadRequest("Photo is already main photo!");

        var currentMainPhoto = user.Photos.FirstOrDefault(x => x.IsMain);
        if (currentMainPhoto != null) currentMainPhoto.IsMain = false;

        photo.IsMain = true;

        if (await _userRepository.SaveAllAsync()) return NoContent();
        return BadRequest("problem setting the main photo!");

    }

    [HttpDelete("delete-photo/{photoID}")]
    public async Task<ActionResult> DeletePhoto(int photoID)
    {
        var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
        var photo = user.Photos.FirstOrDefault(x => x.Id == photoID);
        if (photo == null) return NotFound();
        if (photo.IsMain) return BadRequest("you cannot delete your main photo!");

        if (photo.PublicId != null)
        {

            var result = await _photoService.DeletePhotoAsync(photo.PublicId);
            if (result.Error != null) return BadRequest(result.Error.Message);

        }

        user.Photos.Remove(photo);

        if (await _userRepository.SaveAllAsync()) return Ok();

        return BadRequest("Problem deleting photo");
    }

}
