using shopping_cart_demo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace shopping_cart_demo.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ShoppingCart()
        {
            return View();
        }

        public ActionResult ShoppingCartPubSub()
        {
            return View();
        }

        public JsonResult GetProducts()
        {
            return Json(GetAllProducts(),JsonRequestBehavior.AllowGet);
        }

        private List<ProductModel> GetAllProducts()
        {
            return new List<ProductModel>
            {
                new ProductModel
                {
                    ProductId = 1,
                    Name = "Producto 01",
                    Price = 100
                }
                ,
                new ProductModel
                {
                    ProductId = 2,
                    Name = "Producto 02",
                    Price = 200
                },
                new ProductModel
                {
                    ProductId = 3,
                    Name = "Producto 03",
                    Price = 300
                },
                new ProductModel
                {
                    ProductId = 4,
                    Name = "Producto 04",
                    Price = 400
                }
            };
        }
    }
}