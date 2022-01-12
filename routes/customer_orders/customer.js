const express = require('express');
const router  = express.Router();

module.exports = (db) => {




  router.post("/login", (req, res) => {
    const {email, password} = req.body;
    // if (!email || !password) {
    //   res.send('Not authorized');
    //   return
    // }
    dbFuncs.login(db, email, password)
    .then(user => {
      if(!user) {
        res.statusCode = 401;
        res.send({error: 'Not authorized'});
        return;
      }
      req.session.userId = user.id;
      const restaurant_name = "Five Guys";
      res.redirect(`/restaurants/${restaurant_name}/portal`);
    })
    .catch(err=> {res.send(err.message)});
  });

  return router;
};  router.get("/", (req, res) => {
    const customer_orders = req.session.customer_orders|| {};
    const id1 = Object.keys(customer_orders);
    const customer_orders = [];
    console.log(id1)
    if (id1.length === 0) {
      return res.render('customer_orders', {
        customer_orders,
      })
    }
    db.query(`
      SELECT * FROM food_items WHERE id in (${id1.join(',')})
      `)
      .then(data => {
        console.log(123)
        for (const item of data.rows) {
          const quantity = req.session.customer_orders[item.id1];
          console.log(quantity)
          customer_orders.push(
            Object.assign({}, item, { quantity })
          );
        }
        res.render('customer_order', {
          customer_orders,
        });
      })
      .catch(e => {
        console.log(e);
        res.render('customer_order', {
          customer_orders,
          "error" : e,
        })
      })
  });



  router.post("/", (req, res) => {
    let customer_orders = {};
    if (req.session.cart) {
      customer_orders = req.session.customer_orders;
    }
    if (!customer_orders[req.body.food_item_id]) {
      customer_orders[req.body.food_item_id] = 0;
    }
    customer_orders[req.body.food_item_id]++;
    req.session.customer_orders = customer_orders;
    res.redirect('food_items');
  });
  return router;
}



router.post("/edit", function (req, res) => {




}





  router.post("/delete", (req, res) => {
    if (users[req.session.id1]) {
      userURL = urlsForUser(users[req.session.id1].id, urlDatabase);
      if (Object.keys(userURL).includes(req.params.users)) {
        const users = req.params.users;
        delete urlDatabase[users];
        res.redirect("/urls");
      } else {
        res.status(401).send("Not Authorized to delete this shortURL");
      }
    } else {
      res
        .status(401)
        .send("Not allowed to delete without login <br/><a href='/login'> Login here</a>");
    }
  })


module.exports = router;
