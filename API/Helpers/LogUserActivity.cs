using API.Extentions;
using API.interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Helpers;
public class LogUserActivity : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var resultContext = await next();

        if(!resultContext.HttpContext.User.Identity.IsAuthenticated) return;

        var userid=resultContext.HttpContext.User.GetUserid();
        var repo=resultContext.HttpContext.RequestServices.GetRequiredService<IUserRepository>();

        var user= await repo.GetUserByIdAsync(userid);
        user.LastActive=DateTime.UtcNow;

        await repo.SaveAllAsync();
    }
}
