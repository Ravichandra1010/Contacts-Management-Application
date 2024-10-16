// Controllers/ContactsController.cs
using CMI.Server.Model;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace CMA.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactsController : ControllerBase
    {
        private readonly string jsonFilePath = Path.Combine(Directory.GetCurrentDirectory(), "contacts.json");

        /// <summary>
        /// Retrieves all contacts.
        /// </summary>
        /// <returns>An ActionResult containing the list of contacts.</returns>
        [HttpGet]
        public ActionResult<List<Contact>> GetAll()
        {
            try
            {
                var contacts = LoadContacts();
                return Ok(contacts);
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Retrieves a specific contact by ID.
        /// </summary>
        /// <param name="id">The ID of the contact to retrieve.</param>
        /// <returns>An ActionResult containing the contact or a NotFound result.</returns>
        [HttpGet("{id}")]
        public ActionResult<Contact> Get(int id)
        {
            var contact = FindContactById(id);
            return contact == null ? NotFound() : Ok(contact);
        }

        /// <summary>
        /// Creates a new contact.
        /// </summary>
        /// <param name="contact">The contact to create.</param>
        /// <returns>An ActionResult representing the result of the creation operation.</returns>
        [HttpPost]
        public ActionResult<Contact> Create([FromBody] Contact contact)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                if (IsEmailExists(contact.Email))
                    return Conflict("Email already exists.");

                contact.Id = GenerateNewContactId();
                var contacts = LoadContacts();
                contacts.Add(contact);
                SaveContacts(contacts);
                return CreatedAtAction(nameof(Get), new { id = contact.Id }, contact);
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Updates an existing contact by ID.
        /// </summary>
        /// <param name="id">The ID of the contact to update.</param>
        /// <param name="contact">The updated contact data.</param>
        /// <returns>An ActionResult representing the result of the update operation.</returns>
        [HttpPut("{id}")]
        public ActionResult Update(int id, [FromBody] Contact contact)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var contacts = LoadContacts();
                var existingContact = contacts.FirstOrDefault(c => c.Id == id);
                if (existingContact == null) return NotFound();

                // Check for duplicate email
                if (IsEmailExists(contact.Email, id))
                    return Conflict("Email already exists.");
                
                UpdateContact(existingContact, contact);
                SaveContacts(contacts);
                return NoContent();
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Deletes a contact by ID.
        /// </summary>
        /// <param name="id">The ID of the contact to delete.</param>
        /// <returns>An ActionResult representing the result of the delete operation.</returns>
        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            try
            {
                var contacts = LoadContacts();
                var contact = contacts.FirstOrDefault(c => c.Id == id);
                if (contact == null) return NotFound();

                contacts.Remove(contact);
                SaveContacts(contacts);
                return NoContent();
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Loads the list of contacts from the JSON file.
        /// </summary>
        /// <returns>A list of contacts.</returns>
        private List<Contact> LoadContacts()
        {
            if (!System.IO.File.Exists(jsonFilePath))
            {
                return new List<Contact>();
            }

            var jsonData = System.IO.File.ReadAllText(jsonFilePath);
            return JsonConvert.DeserializeObject<List<Contact>>(jsonData) ?? new List<Contact>();
        }

        /// <summary>
        /// Saves the list of contacts to the JSON file.
        /// </summary>
        /// <param name="contacts">The list of contacts to save.</param>
        private void SaveContacts(List<Contact> contacts)
        {
            var jsonData = JsonConvert.SerializeObject(contacts, Formatting.Indented);
            System.IO.File.WriteAllText(jsonFilePath, jsonData);
        }

        /// <summary>
        /// Finds a contact by ID.
        /// </summary>
        /// <param name="id">The ID of the contact.</param>
        /// <returns>The contact if found; otherwise, null.</returns>
        private Contact FindContactById(int id)
        {
            return LoadContacts().FirstOrDefault(c => c.Id == id);
        }

        /// <summary>
        /// Checks if an email already exists.
        /// </summary>
        /// <param name="email">The email to check.</param>
        /// <param name="excludeId">The ID to exclude from the check (for updates).</param>
        /// <returns>True if the email exists; otherwise, false.</returns>
        private bool IsEmailExists(string email, int excludeId = 0)
        {
            var contacts = LoadContacts();
            return contacts.Any(c => c.Email == email && c.Id != excludeId);
        }

        /// <summary>
        /// Generates a new unique contact ID.
        /// </summary>
        /// <returns>A new unique contact ID.</returns>
        private int GenerateNewContactId()
        {
            var contacts = LoadContacts();
            return contacts.Any() ? contacts.Max(c => c.Id) + 1 : 1;
        }

        /// <summary>
        /// Updates an existing contact with new data.
        /// </summary>
        /// <param name="existingContact">The existing contact to update.</param>
        /// <param name="contact">The new contact data.</param>
        private void UpdateContact(Contact existingContact, Contact contact)
        {
            existingContact.FirstName = contact.FirstName;
            existingContact.LastName = contact.LastName;
            existingContact.Email = contact.Email;
        }
    }
}
