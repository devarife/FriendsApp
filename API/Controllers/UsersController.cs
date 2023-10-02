using System.Security.Claims;
using API.DTOs;
using API.interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;
[Authorize]
public class UsersController : BaseApiController
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public UsersController(IUserRepository userRepository, IMapper mapper)
    {
        _userRepository = userRepository;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
    {
        // var users = await _userRepository.GetUsersAsync();
        // var usersToReturn = _mapper.Map<IEnumerable<MemberDto>>(users);
        var users=await _userRepository.GetMembersAsync();
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
        var username=User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var user=await _userRepository.GetUserByUsernameAsync(username);

        if(user==null) return NotFound();

        _mapper.Map(memberUpdateDto,user);
        
        if(await _userRepository.SaveAllAsync()) return NoContent();

        return BadRequest("Failed to update user!");

    }



}
