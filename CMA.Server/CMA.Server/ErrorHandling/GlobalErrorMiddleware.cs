using System.Net;

namespace CMA.Server.ErrorHandling
{
    public class GlobalErrorMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalErrorMiddleware> _logger;

        public GlobalErrorMiddleware(RequestDelegate next, ILogger<GlobalErrorMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            _logger.LogError(ex, ex.Message);

            context.Response.ContentType = "application/json";

            // Customize error messages based on the exception type
            context.Response.StatusCode = ex.Message.Contains("loading contacts")
                ? (int)HttpStatusCode.InternalServerError
                : (int)HttpStatusCode.InternalServerError;

            var result = new
            {
                StatusCode = context.Response.StatusCode,
                Message = GetErrorMessage(ex.Message)
            };

            return context.Response.WriteAsJsonAsync(result);
        }

        private string GetErrorMessage(string message)
        {
            switch (message)
            {
                case string m when m.Contains(Constants.LoadingContacts):
                    return "Failed to load contacts from the file. Please try again later.";
                case string m when m.Contains(Constants.SavingContacts):
                    return "Failed to saving contacts from the file. Please try again later.";
                default:
                    return "An unexpected error occurred. Please try again later.";
            }
        }
    }
}
