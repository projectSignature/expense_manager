
let accessmainserver = 'http://localhost:8888'　　//メインサーバーのチェックアクセス先
let user
let password
let errormessage
document.getElementById("login-bottom").addEventListener("click", login_check)//ログインボタンクリック時の操作
//ログイン情報の確認をする処理、IDが空白かどうか、その後PASSがくうはくかどうか、TRUEの場合Swal処理
function login_check(user, password) {
  console.log('in')
  user = document.getElementById("user").value;　　　　//ユーザー名
  password = document.getElementById("pass").value;　 //パスワード

  if (user == "") {
    errormessage = "Enter your username"
    swallopen(errormessage)
  } else {
    if (password == "") {
      errormessage = "Enter your password"
      swallopen(errormessage)
    } else {
      login_request(user, password) //chamar função de login passando login e senha
    }
  }
}
//validar dados
async function login_request(user, password) {
  await axios.post(accessmainserver + '/authRestmember', {
    numbers: user,
    password: password
  })
    .then((response) => {
      if (response.status == 200) {
        sessionStorage.setItem("name", response.data[0].user)
        sessionStorage.setItem("id", response.data[0].id)
        //sessionStorage.setItem("restid", response.data[0].rest_id)
        window.location = `../kaikei.html`;
      } else {
        errormessage = "Check username and password";
        document.getElementById("pass").value = "";
        swallopen(errormessage);
      }
    })
    .catch((err) => {
      errormessage = "Check username and password";
      document.getElementById("pass").value = "";
      swallopen(errormessage);
    });
};

function swallopen() {
  Swal.fire({
    title: 'Error',
    icon: 'warning',
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonText: 'back',
    width: 500,
    html: `<span>${errormessage}</span>`,
    customClass: "sweet-alert",
  }).then((result) => {
    if (result.value) {
      Swal.fire({
        icon: "success",
        title: 'concluido',
      }
      )
    }
  });
}
