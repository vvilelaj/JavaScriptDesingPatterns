using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace recursive_settimeout_pattern.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetData(int index)
        {
            System.Threading.Thread.Sleep(new Random().Next(5000));
            return Json(new {
                Name = "Request " + index.ToString() + " - " + DateTime.Now.ToLongDateString()
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult SetTimeOut()
        {
            return View();
        }
    }
}