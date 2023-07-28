//CONFIGS
const express = require('express');
const router = express.Router();
const database = require('../db');


//SCHEMAS
const Categories = require('../schema/table_categories');
const Expenses = require('../schema/table_order_expenses');
const CategoriesRenda = require('../schema/table_categories_renda');
const Renda = require('../schema/table_order_renda');
const ExpenseUser = require('../schema/table_expense_users');

//LIBS
const { Op, Sequelize } = require('sequelize');


//middleware
router.use(function timelog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

//rota principal
router.get('/', async (req, res) => {
  res.json({ message: 'funcionando', status: 200 });
});

//-----despesas----------------------------------------->

//rota para criar despesa
router.post('/new_expenses/:id', async (req, res) => {
  const { name, description, method, value_money, category, status, data_register } = req.body;
  const nu_id = req.params.id
  try {
    await database.sync();

    const newExpenses = await Expenses.create({
      uuid: nu_id,
      name: name,
      memo: description,
      method: method,
      value_money: value_money,
      category: category,
      status: status,
      model: 'despesa',
      data_register: data_register
    });

    if (newExpenses) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    };

  } catch (err) {
    return res.status(400).json(err)
  }

});

//rota para criar categoria
router.post('/new_category', async (req, res) => {
  try {
    await database.sync();
    var { dtUser, iconTag, dtCategoryName, dtCategoryStatus } = req.body;
    const count = await Categories.count();
    const countId = count + 1;

    const newCategories = await Categories.create({
      user: dtUser,
      category_name: dtCategoryName,
      category_status: dtCategoryStatus,
      tag_structured: `
           <div class="category-select-button" id="type${countId}" onclick="selectType(${countId}, event)">
             ${iconTag}
             <div><span>${dtCategoryName}</span></div>
           </div>
         `
    });

    res.json(newCategories);

  } catch (err) {
    res.status(400);
    res.json(err);

  }

});

//buscar categorias
router.post('/category', async (req, res) => {
  const listCategories = await Categories.findAll({
    where: {
      [Op.or]: [
        { category_status: "free" },
        { user: req.body.user }
      ]
    }
  });
  res.json(listCategories)
});

//deletar categoria das despesas
router.delete('/category/del', async (req, res) => {
  console.log(req.body)
  const delCategories = await Categories.destroy({
    where: {
      [Op.and]: [
        { category_name: req.body.categoria },
        { user: req.body.user }
      ]
    }
  });
  res.json(delCategories)
});

//-----rendas----------------------------------------->

//rota para criar renda
router.post('/new_renda/:id', async (req, res) => {
  const { name, description, method, value_money, category, status, data_register } = req.body;
  const nu_id = req.params.id
  try {
    await database.sync();

    const newExpenses = await Renda.create({
      uuid: nu_id,
      name: name,
      memo: description,
      method: method,
      value_money: value_money,
      category: category,
      status: status,
      model: 'renda',
      data_register: data_register
    });

    if (newExpenses) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    };

  } catch (err) {
    return res.status(400).json(err)
  }

});

//rota para criar categoria da renda
router.post('/new_category/renda', async (req, res) => {
  try {
    await database.sync();
    var { dtUser, iconTag, dtCategoryName, dtCategoryStatus } = req.body;
    const count = await CategoriesRenda.count();
    const countId = count + 1;

    const newCategories = await CategoriesRenda.create({
      user: dtUser,
      category_name: dtCategoryName,
      category_status: dtCategoryStatus,
      tag_structured: `
           <div class="category-select-button" id="type${countId}" onclick="selectType(${countId}, event)">
             ${iconTag}
             <div><span>${dtCategoryName}</span></div>
           </div>
         `
    });

    res.json(newCategories);

  } catch (err) {
    res.status(400);
    res.json(err);

  }

});

//buscar categorias da renda
router.post('/category/renda', async (req, res) => {
  const listCategories = await CategoriesRenda.findAll({
    where: {
      [Op.or]: [
        { category_status: "free" },
        { user: req.body.user }
      ]
    }
  });
  res.json(listCategories)
});

//deletar categoria das despesas
router.delete('/category/renda/del', async (req, res) => {
  const delCategories = await CategoriesRenda.destroy({
    where: {
      [Op.and]: [
        { category_name: req.body.categoria },
        { user: req.body.user }
      ]
    }
  });
  res.json(delCategories)
});

//------------geral------------------------------------>
//busacar despesas
router.get('/expenses/:filter/:id', async (req, res) => {
  const nu_filter = req.params.filter;
  const nu_id = req.params.id;

  const despesas = await Expenses.findAll({
    where: { uuid: nu_id }
  });
  const rendas = await Renda.findAll({
    where: { uuid: nu_id }
  });

  switch (nu_filter) {
    case "1":
      let geral = [...despesas, ...rendas];
      res.json(geral);
      break;
    case "2":
      res.json(despesas);
      break;
    case "3":
      res.json(rendas);
      break;
    default:
      res.json({ success: false, message: "nu_filter não informado" });
  }
});

//autenticação
router.post('/authRestmember', async (req, res) => {
  const uuid = req.body.numbers;
  const pass = req.body.password;

  if (pass == '') {
    res.status(404);
    res.json({ success: false, message: "password inválido" })
  } else {
    const user = await ExpenseUser.findAll({
      where: {
        [Op.and]: [
          { user: uuid },
          { password_user: pass }
        ]
      }
    });

    res.send(user)
  }
});

//criação
router.post('/create/user', async (req, res) => {
  const uuid = req.body.numbers;
  const pass = req.body.password;

  try {
    if (pass == '') {
      res.status(404);
      res.json({ success: false, message: "password inválido" })
    } else {
      await database.sync();
      const user = await ExpenseUser.create(
        {
          user: "user",
          cpf: "112312341",
          password_user: pass
        }
      );

      res.send(user)
    }
  } catch (err) {
    console.log(err)
  }

});

module.exports = router;




