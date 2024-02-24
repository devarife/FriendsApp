using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;
public class AdminController : BaseApiController
{
    private readonly UserManager<AppUser> _userManager;

    public AdminController(UserManager<AppUser> userManager)
    {
        _userManager = userManager;
    }



    [Authorize(policy:"RequireAdminRole")]
    [HttpGet("users-with-roles")]
    public async Task<ActionResult> GetUsersWithRole()
    {
        var users= await _userManager.Users
            .OrderBy(u=>u.UserName)        
            .Select(u=>new {
                u.Id,
                userName=u.UserName,
                Roles=u.UserRoles.Select(r=>r.Role.Name).ToList()
            })
            .ToListAsync();

        return Ok(users);
    }

    [Authorize(policy:"RequireAdminRole")]
    [HttpPost("edit-roles/{username}")]
    public async Task<ActionResult> EditRoles(string username, [FromQuery]string roles)
    {
        if(string.IsNullOrEmpty(roles)) return BadRequest("You must select atleast one role!");

        var selectedroles=roles.Split(",").ToArray();
        
        var user= await _userManager.FindByNameAsync(username);

        if(user==null) return NotFound();

        var userroles= await _userManager.GetRolesAsync(user);

        var result = await _userManager.AddToRolesAsync(user,selectedroles.Except(userroles));

        if(!result.Succeeded) return BadRequest("Failed to add to role!");

        result = await _userManager.RemoveFromRolesAsync(user,userroles.Except(userroles));

        if(!result.Succeeded) return BadRequest("Failed to remove roles");

        return Ok(_userManager.GetRolesAsync(user));
    }



    [Authorize(policy:"ModeratePhotoRole")]
    [HttpGet("photos-to-moderate")]
    public ActionResult GetPhotosForModeration()
    {
        return Ok("Admin or moderator");
    }

}
