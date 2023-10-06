using System.Security.Claims;

namespace API.Extentions;
public static class ClaimsPrincipleExtenstion
{
    public static string GetUsername(this ClaimsPrincipal user)
    {
        return user.FindFirst(ClaimTypes.Name)?.Value;
    }
    public static int GetUserid(this ClaimsPrincipal user)
    {
        return int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value);
    }
}
