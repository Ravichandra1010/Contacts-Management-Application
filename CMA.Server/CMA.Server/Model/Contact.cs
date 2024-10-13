using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace CMI.Server.Model
{
    public class Contact
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [Required]
        [JsonProperty("firstname")]
        public string FirstName { get; set; }

        [Required]
        [JsonProperty("lastname")]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        [JsonProperty("email")]
        public string Email { get; set; }
    }

}
