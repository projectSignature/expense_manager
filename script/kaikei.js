
const bkUrl = "http://localhost:8888";
let accessmainserver = 'https://squid-app-ug7x6.ondigitalocean.app';　　//メインサーバーのチェックアクセス先
let user;
let password;
let errormessage;
let proccessKubun = 0;
let paykubun = 0;
let payStatus = 0;
let workerid = sessionStorage.getItem("id");
let menbername = sessionStorage.getItem("name");

//auth
if (workerid == null || menbername == null) {
  pagechange('loginadminrst')
}
//let menbername = "Paulo Shigaki"
document.getElementById('name-span').innerText = menbername;
var today = new Date();
let yyyy = today.getFullYear();
let mm = ("0" + (today.getMonth() + 1)).slice(-2);
let dd = ("00" + today.getDate()).slice(-2);

document.getElementById('calender-input').value = `${yyyy}-${mm}-${dd}`
document.getElementById('keihi-select').style = "background:#FF6928"

function process1(data) {
  if (data == 1) {
    document.getElementById('keihi-select').style = "background:#FF6928"
    document.getElementById('syunyu-select').style = "background:#FFFFFF"
    proccessKubun = 1
  } else {
    pagechange('renda')
    //document.getElementById('syunyu-select').style = "background:#FF6928"
    //document.getElementById('keihi-select').style = "background:#FFFFFF"
    swallErrorOpen('まだ準備できていません')
    //proccessKubun = 2
  }
}

function pagechange(data) {//---------------------------------->
  window.location = `../views/${data}.html`;
}

async function savedata(dataState) {//data is pay status 1:paid,2:yet
  /*   if (restid == null || workerid == null || menbername == null) {
      pagechange('loginadminrst')
    } */
  let datainput = document.getElementById('calender-input').value
  let memo = document.getElementById('memo-pay').value
  let slectPay = document.getElementById('pay-select').value
  let valuePay = document.getElementById('value-input').value
  if (paykubun == 0) {
    swallErrorOpen('科目を選択してください')
  } else if (datainput == "") {
    swallErrorOpen('支払日を選択してください')
  } else if (slectPay == "") {
    swallErrorOpen('決済手段を選択してください')
  } else if (valuePay == "") {
    swallErrorOpen('支払い金額を入力してください')
  } else {

    const objForm = {
      name: "dev",
      description: memo,
      method: slectPay,
      value_money: valuePay,
      category: document.querySelector(`#type${paykubun} span`).innerText,
      status: dataState,
      data_register: datainput
    }

    saveToSql(objForm);

  }

}

async function makerequest3(url, data) {
  console.log('in')
  const request = await fetch(url, {//pegar todos dados do table de pagamentos //n]
    method: 'POST',
    body: JSON.stringify(data),
    headers: { "Content-type": "application/json; charset=UTF-8" }
  })
  return request.status
}

async function makerequest2(url, data) {
  const request = await fetch(url, {//pegar todos dados do table de pagamentos //n]
    method: 'POST',
    body: JSON.stringify(data),
    headers: { "Content-type": "application/json; charset=UTF-8" }
  })
  return request.JSON()
}

async function makerequestStatus(url, data) {
  const request = await fetch(url, {//pegar todos dados do table de pagamentos //n]
    method: 'POST',
    body: JSON.stringify(data),
    headers: { "Content-type": "application/json; charset=UTF-8" }
  })
  return request.status
}
async function makerequest(url) {
  const request = await fetch(url)  //esperar aqui
  return request.json()
}
async function saveToSql(obj) {//---------------------->
  Swal.fire({
    icon: "info",
    title: '登録中',
    html: 'しばらくお待ちください',
    allowOutsideClick: false,
    showConfirmButton: false,
    timerProgressBar: true,
    onBeforeOpen: () => {
      Swal.showLoading();
    }
  })

  const config = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj)
  }

  fetch(`${bkUrl}/new_expenses/${workerid}`, config)
    .then((x) => x.json())
    .then((res) => {
      swal.close();
      swallSuccess();
      document.getElementById('memo-pay').value = '';

      document.getElementById('value-input').value = '';

      const countChildrens = document.querySelector('.category-main-div').children.length;
      for (let i = 1; i <= countChildrens - 1; i++) {
        document.getElementById(`type${i}`).style = "background:#FFFFFF"
      }

    })
}


function selectType(data, event) {
  const childElement = event.currentTarget; // Elemento filho clicado
  const parentElement = childElement.parentNode; // Elemento pai

  const children = Array.from(parentElement.children); // Lista de elementos filhos do pai
  const position = children.indexOf(childElement); // Posição do elemento filho clicado

  const countChildrens = document.querySelector('.category-main-div').children.length;
  for (let i = 0; i <= countChildrens; i++) {
    if (position == i) {
      document.getElementById(`type${data}`).style = "background: #FF6928";
      paykubun = i;
    } else {
      try {
        document.querySelector('.category-main-div').children[i].style = "background: #FFFFFF";
      } catch (err) {
        //document.getElementById(`type${i}`).style = "background: #FFFFFF";

      }
    }
  }
}

function swallErrorOpen(data) {
  Swal.fire({
    icon: 'warning',
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonText: 'back',
    width: 500,
    html: `<span>${data}</span>`,
    customClass: "sweet-alert",
  }).then((result) => {

  });
}

async function swallSuccess() {
  const Toast = await Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  Toast.fire({
    icon: 'success',
    title: 'Feito'
  })
}

//nova validação
async function kanmaReplase() {
  let data = document.getElementById('value-input');
  if (data.value.length === 1 && data.value !== "￥") {
    data.value = ("￥" + data.value);
  } else {
    let numero = data.value;
    // Remove todos os caracteres que não são dígitos ou a vírgula
    let numeroSemPontuacao = numero.replace(/[^\d,]/g, '');

    // Remove a vírgula, se houver, para evitar duplicações
    numeroSemPontuacao = numeroSemPontuacao.replace(/,/g, '');

    // Verifica se não há dígitos após a remoção dos caracteres inválidos
    if (numeroSemPontuacao === '') {
      data.value = '';
      return;
    }

    // Divide o número na parte esquerda e direita da vírgula
    let parteEsquerda = numeroSemPontuacao.slice(0, -2);
    let parteDireita = numeroSemPontuacao.slice(-2);

    // Reconstroi o número com a vírgula na posição correta
    let kanmaAns = parteEsquerda + ',' + parteDireita;

    data.value = `￥${kanmaAns}`;
  }
};


function catgoryCard() {
  const category = `<div class="category-select-button" id="type11" onclick="selectType(11)">
  <img src="./image/k11.png" width="40"/>
  <div><span>消耗品費</span></div>
</div>`;

  const categoryMain = document.querySelector('#type12');

  categoryMain.insertAdjacentHTML('beforebegin', category);
};



//adcionar nova categoria----------------------------->
function addkamoku() {

  const body = `
<!DOCTYPE html>
<html>
<head>
  <title>Nova categoria</title>
  <style>
  #addButton {
    margin-top: 40px;
    font-size: 2rem;
    width: 50px
  }

  .table-product {
    margin-top: 5px !important;
  }

  .container {
    display: flex;
    flex-direction: column;
    gap: 20px
  }

  #category_nm {
    height: 30px;
    width: 100%
  }

  #category-icon {
    display: flex;
    overflow: scroll;
    overflow-y: hidden;
    /* direction: rtl; /* Altera a direção para right-to-left */ * /
height: 90px;
width: 100 %;
  }

  .active {
  border: 2px solid red;
  border - radius: 5px;
}

  li {
  display: flex;
  justify - content: center;
  align - items: center;
  cursor: pointer;
  height: 70 %;
}

@media only screen and(max - width: 800px) {
    .swal2 - popup {
    width: 100 % !important;
  }
}

  </style >
</head >
  <body>
    <main class="container">
      <h2>Adicionar nova categoria</h2>
      <input type="text" id="category_nm" placeholder="nome da categoria" />

      <ul id="category-icon">
      </ul>
    </main>
    <input id="getTag" type="hidden" value="0" />
  </body>
</html >
  `;

  Swal.fire({
    html: body,
    width: '50%',
    showCancelButton: true,
    confirmButtonText: 'Concluir',
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const name = document.querySelector('#category_nm');
      if (name.value === '') {
        Swal.showValidationMessage('Por favor, preencha todos os campos');
      }
    },
    didOpen: () => {
      const areaIconSelected = document.querySelector('#category-icon');

      for (let i = 1; i <= 32; i++) {
        const img = `<li> <img src="../image/k${i}.png" width="40" /></li> `;

        areaIconSelected.insertAdjacentHTML('afterbegin', img);
      };

      const li = document.querySelectorAll('li');
      const el = Array.from(li);

      el.forEach((icon) => {

        icon.addEventListener('click', (event) => {
          const clickedLi = event.currentTarget;
          el.forEach((selected) => {
            selected.classList.remove('active');
          });
          clickedLi.classList.add('active');
          document.querySelector("#getTag").value = clickedLi.children[0].outerHTML.toString();
        });
      });
    }

  }).then((result) => {
    const categoryName = document.querySelector("#category_nm").value;
    const iconTag = document.querySelector("#getTag").value;
    if (result.isConfirmed) {
      fetch(`${bkUrl}/new_category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "dtUser": workerid, //alterar em produção
          "iconTag": iconTag,
          "dtCategoryName": categoryName,
          "dtCategoryStatus": "vip"
        })
      })
        .then((x) => x.json())
        .then((res) => {
          console.log("criado...");
          const categoriaDiv = document.querySelector('#btn-add');
          categoriaDiv.insertAdjacentHTML('beforebegin', res.tag_structured);
        })
    }
  })



  //catgoryCard();

  // swallErrorOpen("追加の権限がありません")
}

function dayChange(data) {
  let dt = document.getElementById("calender-input")
  let date = new Date(dt.value.split("-")[0], dt.value.split("-")[1] - 1, dt.value.split("-")[2]);
  if (data == 2) {
    date.setDate(date.getDate() + 1)
  } else {
    date.setDate(date.getDate() - 1)
  }
  let dM = (("0" + (date.getMonth() + 1)).slice(-2))
  let dd = (("0" + date.getDate()).slice(-2))
  dt.value = `${date.getFullYear()}-${dM}-${dd}`
}

//---------------dev_kledisom------------------------>
function buscarCategorias() {
  fetch(`${bkUrl}/category`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      "user": workerid
    })
  })
    .then((x) => x.json())
    .then((res) => {
      listCategory(res);
    })

  function listCategory(data) {

    data.map((tag) => {
      const categoriaDiv = document.querySelector('#btn-add');
      categoriaDiv.insertAdjacentHTML('beforebegin', tag.tag_structured);
    })

  }
};

buscarCategorias();


///----------------deletar category---------------->
var editorMode = false;

const icoElement = document.querySelector('#ico-config');

icoElement.addEventListener('click', () => {

  Swal.fire('Clique na categoria de deseja excluir!');

  // Adicionar classe de foco na div especificada
  const div = document.querySelector('.category-main-div');
  if (div.classList.contains('focus')) {
    // Remover classes de foco e destaque de todas as divs
    document.querySelectorAll('.div-comon-division-common, .category-main-div, .regist-button').forEach(divs => {
      divs.classList.remove('focus');
      divs.classList.remove('dim');
      document.querySelector('#btn-add').style.display = "flex";
      console.log(divs);
    });
  } else {
    div.classList.add('focus');

    document.querySelector('#btn-add').style.display = "none";

    //--------------deletar categorias------------------------------->
    const elements = document.querySelectorAll('.category-select-button');
    elements.forEach((categoria) => {
      categoria.addEventListener('click', () => {
        let nomeCategoria = document.querySelector('.category-select-button');

        Swal.fire({
          text: `Você tem certeza que deseja deletar a categoria: ${categoria.children[1].children[0].innerText}`,
          width: '80%',
          showCancelButton: true,
          confirmButtonText: 'Confirmar',
          cancelButtonText: "Cancelar",
        })
          .then((result) => {
            if (result.isConfirmed) {

              fetch(`${bkUrl}/category/del`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  "categoria": categoria.children[1].children[0].innerText,
                  "user": workerid
                })
              })
                .then((x) => x.json())
                .then((res) => {
                  let areaCategoria = document.querySelector('.category-main-div');
                  areaCategoria.innerHTML = '';
                  document.querySelector('.category-main-div').innerHTML = `
                   <div class="category-select-button" id="btn-add" onclick="addkamoku(12)">
                    <img src='./image/icon_add.png' width="40"/>
                    <div><span>科目追加</span></div>
                  </div>`
                  document.querySelector('#btn-add').style.display = "none";

                  swallSuccess();

                  buscarCategorias();

                  // Remover classes de foco e destaque de todas as divs
                  document.querySelectorAll('.div-comon-division-common, .category-main-div, .regist-button').forEach(divs => {
                    divs.classList.remove('focus');
                    divs.classList.remove('dim');
                    document.querySelector('#btn-add').style.display = "flex";
                    console.log(divs);
                  });
                })
            }
          })
      })
    })


    // Adicionar classe de destaque nas outras divs
    document.querySelectorAll('.div-comon-division-common, .category-main-div, .regist-button').forEach(div => {
      if (div !== document.querySelector('.category-main-div')) {
        div.classList.add('dim');
      }
    });
  }
});









