﻿using API.DTOs;
using API.Entities;
using API.Extentions;
using API.Helpers;
using API.interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;
public class LikesController : BaseApiController
{
    private readonly IUserRepository _userRepository;
    private readonly ILikesRepository _likesRepository;

    public LikesController(IUserRepository userRepository, ILikesRepository likesRepository)
    {
        _userRepository = userRepository;
        _likesRepository = likesRepository;
    }

    [HttpPost("{username}")]
    public async Task<ActionResult> AddLike(string username)
    {
        var sourceUserId=User.GetUserid();
        var likedUser=await _userRepository.GetUserByUsernameAsync(username);
        var sourceUser= await _likesRepository.GetUserWithLikes(sourceUserId);

        if(likedUser==null) return NotFound();

        if(sourceUser.UserName==username) return BadRequest("You cannot like yourself");

        var userLike= await _likesRepository.GetUserLike(sourceUserId,likedUser.Id);

        if(userLike!=null) return BadRequest("You have already liked this user!");

        userLike=new UserLike
        {
            SourceUserID=sourceUserId,
            TargetUserID=likedUser.Id
        };

        sourceUser.LikedUsers.Add(userLike);

        if(await _userRepository.SaveAllAsync()) return Ok();

        return BadRequest("something went wrong!");
    }

    [HttpGet]
    public async Task<ActionResult<PagedList<LikeDto>>> GetUserLikes([FromQuery]LikesParams likesParams)
    {
        likesParams.UserId=User.GetUserid();

        var users= await _likesRepository.GetUserLikes(likesParams);

        Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage,users.PageSize,users.TotalCount,users.TotalPages));

        return Ok(users);
    }
}
