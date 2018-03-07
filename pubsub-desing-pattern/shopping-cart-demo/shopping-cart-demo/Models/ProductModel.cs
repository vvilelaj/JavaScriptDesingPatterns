using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace shopping_cart_demo.Models
{
    public class ProductModel
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
    }
}