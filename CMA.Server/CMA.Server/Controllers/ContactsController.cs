// Controllers/ContactsController.cs
using CMI.Server.Model;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
namespace CMA.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ContactsController : ControllerBase
    {
        private string JsonFilePath = Directory.GetCurrentDirectory()+"\\contacts.json";

        private List<Contact> LoadContacts()
        {
            if (!System.IO.File.Exists(JsonFilePath))
            {
                return new List<Contact>();
            }
            var jsonData = System.IO.File.ReadAllText(JsonFilePath);
            return JsonConvert.DeserializeObject<List<Contact>>(jsonData) ?? new List<Contact>();
        }

        private void SaveContacts(List<Contact> contacts)
        {
            var jsonData = JsonConvert.SerializeObject(contacts, Formatting.Indented);
            System.IO.File.WriteAllText(JsonFilePath, jsonData);
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var contacts = LoadContacts();
            return Ok(contacts);
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var contacts = LoadContacts();
            var contact = contacts.FirstOrDefault(c => c.Id == id);
            if (contact == null) return NotFound();
            return Ok(contact);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Contact contact)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var contacts = LoadContacts();

            // Check for duplicate email
            if (contacts.Any(c => c.Email == contact.Email))
            {
                return Conflict("Email already exists.");
            }

            contact.Id = contacts.Any() ? contacts.Max(c => c.Id) + 1 : 1;
            contacts.Add(contact);
            SaveContacts(contacts);
            return CreatedAtAction(nameof(Get), new { id = contact.Id }, contact);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Contact contact)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var contacts = LoadContacts();
            var existingContact = contacts.FirstOrDefault(c => c.Id == id);
            if (existingContact == null) return NotFound();

            // Check for duplicate email
            if (contacts.Any(c => c.Email == contact.Email && c.Id != id))
            {
                return Conflict("Email already exists.");
            }

            existingContact.FirstName = contact.FirstName;
            existingContact.LastName = contact.LastName;
            existingContact.Email = contact.Email;
            SaveContacts(contacts);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var contacts = LoadContacts();
            var contact = contacts.FirstOrDefault(c => c.Id == id);
            if (contact == null) return NotFound();

            contacts.Remove(contact);
            SaveContacts(contacts);
            return NoContent();
        }
    }
}
