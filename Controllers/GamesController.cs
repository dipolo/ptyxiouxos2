using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Ptyxiouxos2.Controllers
{
    public class GamesController : Controller
    {
        //
        // GET: /Games/
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Tangram()
        {
            ViewBag.Message = "Tangram page.";
            return View();
        }

	}
}