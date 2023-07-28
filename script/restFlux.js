
let accessmainserver = 'https://squid-app-ug7x6.ondigitalocean.app'　　//メインサーバーのチェックアクセス先
let user
let password
let errormessage
let proccessKubun = 0
let paykubun = 0
let payStatus = 0
//let restid=0
//let workerid=0
let saiTotal = 2000000
let saveArray1 = []
let restid=sessionStorage.getItem("restid")
let workerid=sessionStorage.getItem("id")
let menbername = sessionStorage.getItem("name")
if(restid==null||workerid==null||menbername==null){
  pagechange('loginadminrst')
}
document.getElementById('name-span').innerText = menbername
var today = new Date();
let yyyy = today.getFullYear();
let mm = ("0"+(today.getMonth()+1)).slice(-2);
let dd = ("00" + today.getDate()).slice(-2);
let id = '0'

//document.getElementById('calender-input').value = `${yyyy}-${mm}-${dd}`
//document.getElementById('keihi-select').style = "background:#FF6928"
getcosthistory()
async function getcosthistory(){
  if(restid==null||workerid==null||menbername==null){
    pagechange('loginadminrst')
  }
  let row = ""
  let sumTotal = 0
  const payname =  await makerequest(`https://squid-app-ug7x6.ondigitalocean.app/costRestGet?id=${id}`)　//支出の項目をGET
  saveArray1 = await payname
  for(let i=0;i<payname.length;i++){
    let dt = `${payname[i].payday.split("-")[1]}/${payname[i].payday.split("-")[2]}`
     sumTotal += (payname[i].amount -0)
    let myimg = `../image/k${payname[i].cost_id}.png`
    row += `
    <div class="keihi-show-history-child" onclick="swalldeatalShow('${payname[i].id}')">
       <div class="keihi-show-history-day">${dt}</div>
       <img src="${myimg}" width="40" class="setting-right-button"  />
       <div class="keihi-show-history-name">${await getname(payname[i].cost_id)}</div>
       <div class="keihi-show-history-value">${await kanmaReplase(payname[i].amount)}</div>
       <div class="keihi-show-history-day">${await payinfGet(payname[i].paykubun)}</div>
    </div>
    `
  }
   document.getElementById("insert-inner-html1").innerHTML += row
  //await createHistory(payname)
  saiTotal = saiTotal - sumTotal
   const totalAnswer = await kanmaReplaseNoSyousuu(sumTotal,1)
   document.getElementById("sisyutsu-div").innerText = totalAnswer[0]
   document.getElementById("sisyutsu-div").style = totalAnswer[1]
   const siTotal = await kanmaReplaseNoSyousuu(saiTotal,2)
   document.getElementById("goukei-div").innerText = siTotal[0]
   document.getElementById("goukei-div").style = siTotal[1]
}

async function payinfGet(data){
  let answer = ""
  if(data==0){
    answer = "ゆうちょ銀行"
  }else if(data==1){
    answer = "現金"
  }else if(data==2){
    answer = "クレジット"
  }
  return answer
}

async function kanmaReplase(data){
   let numberAns = (data.split(".")[0]).replace(/[^0-9]/g, "");
   kanmaAns = numberAns.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
   return `-￥${kanmaAns}`
   //return `￥${kanmaAns}`
};

async function kanmaReplaseNoSyousuu(data,kubun){
  console.log(data.toString())
  let kigou = ""
  let color = "color:#000080"
  let answerArray = []
  if(kubun==1||data<0){
    kigou = "-"
    color = "color:#FF0000"
  }
   let numberAns = (data.toString()).replace(/[^0-9]/g, "");
   kanmaAns = numberAns.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
   await answerArray.push(`${kigou}￥${kanmaAns}`,color)
   return answerArray
   //return `￥${kanmaAns}`
};

async function getname(data){
  let answer = ""
  if(data==1){
    answer = "仕入れ"
  }else if(data==2){
    answer = "給与"
  }else if(data==3){
    answer = "通信"
  }else if(data==4){
    answer = "水道光熱費"
  }else if(data==5){
    answer = "荷造運賃"
  }else if(data==6){
    answer = "広告宣伝費"
  }else if(data==7){
    answer = "地代家賃"
  }else if(data==8){
    answer = "修繕費"
  }else if(data==9){
    answer = "雑費"
  }else if(data==10){
    answer = "損害保険"
  }else if(data==11){
    answer = "消耗品"
  }
  return answer
}

async function makerequest(url){
  const request = await fetch(url)
 return request.json()
}

async function swalldeatalShow(data){
  console.log(saveArray1)
  let row=""
  for(let i=0;i<saveArray1.length;i++){
    if(data==saveArray1[i].id){
      console.log(i)
      console.log(saveArray1[i].id)
      let dt = `${saveArray1[i].payday}`
      console.log(dt)
       row=`
      <div class="div-comon-division-common">
        <div class="date-div-span">日付</div>
        <div class="right-div-add" onclick="dayChange(1)"><</div>
        <div class="center-colomn-div"><input type="date" class="calender-input" id="calender-input" required value="${dt}"/></div>
        <div class="right-div-add" onclick="dayChange(2)">></div>
      </div>
      <div id="textup" class="div-comon-division-common">
        <div class="date-div-span">メモ</div>
        <div class="right-div-add"></div>
        <div class="center-colomn-div"><textarea placeholder="内容入力" type="text" id="memo-pay"　rowa="8" cols="40"　required class="calender-input-text">${saveArray1[i].memo}</textarea></div>
        <div class="right-div-add"></div>
      </div>
      <div class="div-comon-division-common">
       <div class="date-div-span">方法</div>
       <div class="right-div-add"></div>
       <div class="center-colomn-div">
         <select id="pay-select">
           ${getpayinf(saveArray1[i].paykubun)}
         </select>
       </div>
      <div class="right-div-add"></div>
     </div>

   <div class="div-comon-division-common">
     <div class="date-div-span">金額</div>
     <div class="right-div-add"></div>
     <div class="center-colomn-div"><input placeholder="￥" type="text" class="calender-input" id="value-input" oninput="kanmaReplase()"
     inputmode="numeric" required value="${await kanmaReplase(saveArray1[i].amount)}"/></div>
     <div class="right-div-add"></div>
   </div>
   <style>
   .swal2-popup {
       width: 90% !important;
       height: 500px !important;
   }
   </style>`

    }
  }
  await swallOpen(row)
console.log(data)
}

function getpayinf(data){
  let row = ""
  for (let i=0;i<3;i++){
    if(data==i){
      row+=`<option value=${i} selected>${getnamePay(i)}</option>`
    }else{
      row+=`<option value=${i} >${getnamePay(i)}</option>`
    }
  }
  return row
}

function getnamePay(data){
  let answer = ""
  if(data==0){
    answer = "ゆうちょ銀行"
  }else if(data==1){
    answer = "現金"
  }else{
    answer = "クレジット"
  }
  return answer
}

function swallOpen(data) {
  Swal.fire({
    showCancelButton: true,
    showConfirmButton: true,
    cancelButtonText:'戻る',
    confirmButtonText:"変更する",
    allowOutsideClick : false,
    html: `${data}`
  }).then((result) => {
    if(result.isConfirmed){
swallErrorOpen("準備中,すまん")
    }
  });
}

function dayChange(data){
  let dt = document.getElementById("calender-input")
  let date = new Date(dt.value.split("-")[0], dt.value.split("-")[1]-1, dt.value.split("-")[2]);
  if(data==2){
    date.setDate(date.getDate() + 1)
  }else{
    date.setDate(date.getDate() - 1)
  }
  let dM = (("0" + (date.getMonth()+1)).slice(-2))
  let dd = (("0" + date.getDate()).slice(-2))
  dt.value = `${date.getFullYear()}-${dM}-${dd}`
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
