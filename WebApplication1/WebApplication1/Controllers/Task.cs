using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;
using System.Collections.Concurrent;

namespace WebApplication1.Controllers;

    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class TaskController : Controller
    {
        private static readonly ConcurrentDictionary<string, Todo> Tasks = new()
        {
            ["Task1"] = new Todo("Task1", "Description1"),
            ["Task2"] = new Todo("Task2", "Description2")
        };

        [HttpGet]
        [RequiredScope("tasks.read")]
        public IActionResult Get()
        {
        return Json(Tasks.OrderBy(t => t.Key)
         .Select(item => new {
             title = item.Key,
             description =
         item.Value.Description
         }));
    }

        [HttpPost]
        [RequiredScope("tasks.write")]
        public IActionResult Post()
        {
            var task = new Todo($"Task{Tasks.Count + 1}",
            $"Description{Tasks.Count + 1}");
            Tasks.TryAdd(task.Title, task);
            return Json(Tasks.OrderBy(t => t.Key)
            .Select(item => new {
                title = item.Key,
                description =
            item.Value.Description
            }));
        }
    }
public  class Todo
{
    public Todo(string title, string description)
    {
        this.Title = title;
        this.Description = description; 
    }
  
    private string description;
    public string Description
    {
        get { return description; }
        set { description = value; }
    }
    private string title;
    public string Title
    {
        get { return title; }
        set { title = value; }
    }
}


