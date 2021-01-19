// const { items : products } = require('./products.json');
// console.log(products);

const _PRODUCTS = {
  items: [
    {
      sys: { id: "1" },
      fields: {
        title: "queen panel bed",
        price: 10.99,
        image: { fields: { file: { url: "./images/product-1.jpeg" } } },
      },
    },
    {
      sys: { id: "2" },
      fields: {
        title: "king panel bed",
        price: 12.99,
        image: { fields: { file: { url: "./images/product-2.jpeg" } } },
      },
    },
    {
      sys: { id: "3" },
      fields: {
        title: "single panel bed",
        price: 12.99,
        image: { fields: { file: { url: "./images/product-3.jpeg" } } },
      },
    },
    {
      sys: { id: "4" },
      fields: {
        title: "twin panel bed",
        price: 22.99,
        image: { fields: { file: { url: "./images/product-4.jpeg" } } },
      },
    },
    {
      sys: { id: "5" },
      fields: {
        title: "fridge",
        price: 88.99,
        image: { fields: { file: { url: "./images/product-5.jpeg" } } },
      },
    },
    {
      sys: { id: "6" },
      fields: {
        title: "dresser",
        price: 32.99,
        image: { fields: { file: { url: "./images/product-6.jpeg" } } },
      },
    },
    {
      sys: { id: "7" },
      fields: {
        title: "couch",
        price: 45.99,
        image: { fields: { file: { url: "./images/product-7.jpeg" } } },
      },
    },
    {
      sys: { id: "8" },
      fields: {
        title: "table",
        price: 33.99,
        image: { fields: { file: { url: "./images/product-8.jpeg" } } },
      },
    },
  ],
};

class ElementBuilder {
  constructor(elementName) {
    this.element = document.createElement(elementName);
    this.className = (name) => {
      this.element.className = name;
      return this;
    };
    this.src = (src) => {
      this.element.src = src;
      return this;
    };
    this.alt = (alt) => {
      this.element.alt = alt;
      return this;
    };
    this.html = (htmlValue) => {
      this.element.innerHTML = htmlValue;
      return this;
    };
    this.addEvent = (name, fn) => {
      this.element.addEventListener(name, fn);
      return this;
    };
    this.appendTo = (parent) => {
      if (parent instanceof ElementBuilder) {
        parent.build().appendChild(this.element);
      } else {
        parent.appendChild(this.element);
      }
      return this;
    };
    this.build = () => {
      return this.element;
    };
  }
}

const builder = {
  create: function (elementName) {
    return new ElementBuilder(elementName);
  },
};

class Product {
  constructor(id, title, price, image) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.image = image;
  }

  init() {
    // document.querySelector('.products-center') is a better choice
    const productsCenter = document.getElementsByClassName(
      "products-center"
    )[0];
    const product = builder
      .create("div")
      .className("product")
      .appendTo(productsCenter);

    const imgContainer = builder
      .create("div")
      .className("img-container")
      .appendTo(product);
    builder
      .create("img")
      .src(this.image)
      .className("product-img")
      .alt(this.title)
      .appendTo(imgContainer);
    builder
      .create("button")
      .className("bag-btn")
      .html(
        `<i class=" fas fa-shopping-cart"></i>
        <span>Add to cart </span>
        <i class=" fas fa-shopping-cart"></i>`
      )
      .addEvent("click", () => {
        let index = cartManager.find(this.id);

        if (index === -1) {
          let cartItem = new CartItem(
            this.id,
            this.title,
            this.price,
            this.image
          );
          // Redundant code...
          cartItem.counter++;
          // cartItem.totalItemPrice = cartItem.price * cartItem.counter; // This should be removed.
          cartManager.cartItemsList.push(cartItem);
          cartManager.totalItem++;
          document.getElementsByClassName("cart-items")[0].textContent =
            cartManager.totalItem;
        } else {
          // Redundant code...
          let cm = cartManager.cartItemsList[cartManager.find(this.id)];
          cm.counter++;
          // cm.totalItemPrice = cm.price * cm.counter; // This should be removed.
          cartManager.totalItem++;
          document.getElementsByClassName("cart-items")[0].textContent =
            cartManager.totalItem;
        }
        cartManager.init();
      })
      .appendTo(imgContainer);
    builder.create("h3").html(this.title).appendTo(product);
  }
}

class ProductBuilder {
  constructor() {
    _PRODUCTS.items.map((product) => { // forEach is a better choice.
      const p = new Product(
        product.sys.id,
        product.fields.title,
        product.fields.price,
        product.fields.image.fields.file.url
      );

      p.init();
    });
  }
}

const productBuilder = new ProductBuilder();

class CartItem {
  constructor(id, title, price, image) {
    this.id = id;
    this.title = title;
    this.image = image;
    this.counter = 0;
    this.price = price;
    // this.totalItemPrice = 0; // This should be removed.
  }

  // You can encapsualte some detail here...
  increase = () => {
    this.counter++;
  }

  decrease = () => {
    this.counter--;
  }

  getTotalItemPrice = () => this.counter * this.price;
}

class CartManager {
  constructor() {
    this.cartItemsList = [];
    // this.totalPrice = 0; // This should be removed.
    this.totalItem = 0;
    this.cartOverlay = document.getElementsByClassName("cart-overlay")[0];
    this.cart = document.getElementsByClassName("cart")[0];

    document
      .getElementsByClassName("cart-btn")[0]
      .addEventListener("click", () => {
        this.cartOverlay.classList.add("transparentBcg");
        this.cart.classList.add("showCart");
        cartManager.init();
      });
  }

  // Added
  getTotalPrice() {
    return this.cartItemsList.reduce((prev, cur) => prev + cur.getTotalItemPrice(), 0);
  }

  init() {
    this.cart.innerHTML = "";
    // this.totalPrice = 0;
    builder
      .create("i")
      .className("fas fa-window-close close-cart")
      .addEvent("click", () => {
        this.cartOverlay.classList.remove("transparentBcg");
        this.cart.classList.remove("showCart");
      })
      .appendTo(this.cart);
    builder.create("h2").html("Your Cart").appendTo(this.cart);
    this.cartItemsList.forEach((item) => {
      const cartItem = builder
        .create("section")
        .className("cart-item")
        .appendTo(this.cart);
      builder.create("img").src(item.image).alt(item.title).appendTo(cartItem);
      const itemInfo = builder.create("div").appendTo(cartItem);
      builder.create("h4").html(item.title).appendTo(itemInfo);
      //builder.create("h5").html(item.totalItemPrice).appendTo(itemInfo);
      builder.create("h5").html(item.getTotalItemPrice()).appendTo(itemInfo);
      builder
        .create("div")
        .className("remove-item")
        .html("remove")
        .addEvent("click", () => {
          let i = cartManager.find(item.id);
          cartManager.totalItem -= this.cartItemsList[i].counter;
          this.cartItemsList.splice(i, 1);
          document.getElementsByClassName("cart-items")[0].textContent =
            cartManager.totalItem;
          cartManager.init();
        })
        .appendTo(itemInfo);
      const amountDiv = builder.create("div").appendTo(cartItem);
      builder
        .create("i")
        .className("fas fa-chevron-up")
        .addEvent("click", () => {
          item.counter++;
          // item.totalItemPrice += item.price; // This should be removed.
          cartManager.totalItem++;
          document.getElementsByClassName("cart-items")[0].textContent =
            cartManager.totalItem;
          cartManager.init();
        })
        .appendTo(amountDiv);
      builder
        .create("div")
        .className("item-amount")
        .html(item.counter)
        .appendTo(amountDiv);
      builder
        .create("i")
        .className("fas fa-chevron-down")
        .addEvent("click", () => {
          item.counter--;
          // item.totalItemPrice -= item.price; // This should be removed.
          cartManager.totalItem--;
          document.getElementsByClassName("cart-items")[0].textContent =
            cartManager.totalItem;
          if (item.counter <= 0) {
            let i = cartManager.find(item.id);
            this.cartItemsList.splice(i, 1);
          }
          cartManager.init();
        })
        .appendTo(amountDiv);
    });
    const cartFooter = builder
      .create("section")
      .className("cart-footer")
      .appendTo(this.cart);

    // this.totalPrice = this.cartItemsList.reduce((prev, cur) => prev + cur.getTotalItemPrice(), this.totalPrice)
    // this.cartItemsList.forEach((i) => {
    //   this.totalPrice += i.totalItemPrice;
    // });
    builder
      .create("h3")
      // .html(`<h3>Your Total: <span>${this.totalPrice}</span></h3>`)
      .html(`<h3>Your Total: <span>${this.getTotalPrice()}</span></h3>`)
      .appendTo(cartFooter);

    builder
      .create("button")
      .className("banner-btn")
      .html("Clear Cart")
      .addEvent("click", () => {
        cartManager.totalItem = 0;
        document.getElementsByClassName("cart-items")[0].textContent =
          cartManager.totalItem;
        cartManager.cartItemsList = [];
        cartManager.init();
      })
      .appendTo(cartFooter);
  }

  find = id => this.cartItemsList.findIndex(p => p.id === id);

  // find = (id) => {
  //   let item = this.cartItemsList.find((p) => id === p.id);
  //   let index = this.cartItemsList.indexOf(item);
  //   return index;
  // };
}

let cartManager = new CartManager();
