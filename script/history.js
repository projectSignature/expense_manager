const urlDev = 'http://localhost:8888';
let workerid = sessionStorage.getItem("id");

//--------------------------------------------------------------------------------------------->

const changeGrafic = document.querySelector('#change-grafic');
changeGrafic.addEventListener('click', (e) => {

    const historyArea = document.querySelector('.aba-history');
    const graficArea = document.querySelector('#grafic-area');
    const historyValue = window.getComputedStyle(historyArea).display;
    const graficValue = window.getComputedStyle(graficArea).display;
    const calenderArea = document.querySelector('#change-calender');



    if (historyValue == 'flex' || calenderArea == 'flex') {
        document.querySelector('.aba-history').style.display = 'none';
        document.querySelector('.aba-calender').style.display = 'none';
        document.querySelector('#grafic-area').style.display = 'flex';
        document.querySelector('#grafic-area-pie').style.display = 'flex';

    } else {
        document.querySelector('#grafic-area').style.display = 'none';
        document.querySelector('.aba-calender').style.display = 'none';
        document.querySelector('#grafic-area-pie').style.display = 'none';
        document.querySelector('.aba-history').style.display = 'flex';
    }
});

const changeCalender = document.querySelector('#change-calender');
changeCalender.addEventListener('click', (e) => {

    const historyArea = document.querySelector('.aba-history');
    const graficArea = document.querySelector('#grafic-area');
    const calenderArea = document.querySelector('#change-calender');
    const historyValue = window.getComputedStyle(historyArea).display;
    const graficValue = window.getComputedStyle(graficArea).display;



    if (historyValue == 'flex' || graficValue == 'flex') {
        document.querySelector('#grafic-area').style.display = 'none';
        document.querySelector('.aba-history').style.display = 'none';
        document.querySelector('#grafic-area-pie').style.display = 'none';
        document.querySelector('.aba-calender').style.display = 'flex';

    } else {
        document.querySelector('#grafic-area').style.display = 'none';
        document.querySelector('.aba-calender').style.display = 'none';
        document.querySelector('#grafic-area-pie').style.display = 'none';
        document.querySelector('.aba-history').style.display = 'flex';
    }
});

//----------buscar dados de despesas e rendas------------->
function getAllData(nuFilter) {
    fetch(`${urlDev}/expenses/${nuFilter}/${workerid}`)
        .then((x) => x.json())
        .then((res) => {
            const element = document.querySelector('.history-area');
            element.innerHTML = '';
            res.forEach((dado) => {
                addCard(dado);

            });
            sessionStorage.setItem('csv', JSON.stringify(res));
        })
};

getAllData(1);

//------------add card----------------->
function addCard(data) {
    const element = document.querySelector('.history-area');

    let novoCard = `      <ul class="new-card">
  <li><span>ID: </span><span>${data.id}</span></li>
  <li><span>NAME: </span><span>${data.name}</span></li>
  <li><span>DATA_REGISTER: </span><span>${data.data_register}</span></li>
  <li><span>METHOD: </span><span>${data.method}</span></li>
  <li><span>VALUE_MONEY: </span><span>${data.value_money}</span></li>
  <li><span>CATEGORY: </span><span>${data.category}</span></li>
  <li><span>STATUS: </span><span>${data.status}</span></li>
  <li><span>MEMO: </span><span>${data.memo}</span></li>
</ul>`;

    element.insertAdjacentHTML('beforeend', novoCard);

};

const inputArray = JSON.parse(sessionStorage.getItem('csv'));

// Create a new array with the desired format
const arr = [["id", "name", "valor", "cat"]];

const data1 = inputArray.map(item => {

    arr.push([item.id, item.name, parseInt(item.value_money.replace(/[￥,]/g, '')), item.category]);

});

///==============================================>
// Função para converter os dados em formato XLSX
function converterParaXLSX(data) {
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'dados');
    const xlsxContent = XLSX.write(workbook, { type: 'array' });
    const blob = new Blob([xlsxContent], { type: 'application/octet-stream' });
    return URL.createObjectURL(blob);
}

// Função para baixar o arquivo XLSX
function baixarXLSX(xlsxContent, format) {
    const link = document.createElement('a');
    link.href = xlsxContent;
    link.setAttribute('download', `dados.${format}`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Evento do botão para salvar o arquivo XLSX
document.getElementById('xlsx').addEventListener('click', function () {
    const xlsxContent = converterParaXLSX(arr);
    baixarXLSX(xlsxContent, "xlsx");
});
// Evento do botão para salvar o arquivo XLSX
document.getElementById('csv').addEventListener('click', function () {
    const xlsxContent = converterParaXLSX(arr);
    baixarXLSX(xlsxContent, "csv");
});



//calendario js-------------------------------->
const dadosPorDia = {};

// Função para adicionar os dados de renda e despesa para cada dia
function adicionarDadosPorDia(data) {
    let dataFormatada = data.data_register;
    let valorRenda = data.model === 'renda' ? data.value_money : '';
    if (valorRenda !== '') {
        valorRenda = Number(valorRenda.replace('￥', '').replace(',', '.')).toFixed(2);
    }

    let valorDespesa = data.model === 'despesa' ? data.value_money : '';
    if (valorDespesa !== '') {
        valorDespesa = Number(valorDespesa.replace('￥', '').replace(',', '.'));

    }

    if (dadosPorDia.hasOwnProperty(dataFormatada)) {
        if (!isNaN(valorRenda)) {
            dadosPorDia[dataFormatada].renda += Number(valorRenda);
        }
        if (!isNaN(valorDespesa)) {
            dadosPorDia[dataFormatada].despesa += Number(valorDespesa);
        }
    } else {
        dadosPorDia[dataFormatada] = { renda: Number(valorRenda), despesa: Number(valorDespesa) };
    }

}

inputArray.forEach(adicionarDadosPorDia);


// Variável para armazenar a data atual do calendário
let dataAtual = new Date();

// Função para calcular o total de renda e despesa por dia
function calcularTotais() {
    const totalRendaElement = document.getElementById('total-renda');
    const totalDespesaElement = document.getElementById('total-despesa');

    // Obtém o valor atual dos totais
    let totalRenda = 0;
    let totalDespesa = 0;

    // Itera pelos dados de cada dia e atualiza os totais
    for (const data in dadosPorDia) {
        if (dadosPorDia.hasOwnProperty(data)) {
            totalRenda += dadosPorDia[data].renda;
            totalDespesa += dadosPorDia[data].despesa;
        }
    }

    // Atualiza o conteúdo no DOM
    totalRendaElement.textContent = totalRenda;
    totalDespesaElement.textContent = totalDespesa;
}

// Função para criar o calendário
function criarCalendario() {
    const calendarElement = document.getElementById('calendar');
    const mesAtualElement = document.getElementById('mes-atual');

    // Limpa o conteúdo do calendário
    calendarElement.innerHTML = '';

    // Define o primeiro dia do mês atual
    const primeiroDiaDoMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
    const ultimoDiaDoMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0);

    // Define o cabeçalho com o mês e ano atual
    mesAtualElement.textContent = primeiroDiaDoMes.toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric',
    });

    // Cria uma tabela para o calendário
    const table = document.createElement('table');
    const headerRow = table.insertRow();
    const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    // Cria o cabeçalho da tabela com os dias da semana
    diasDaSemana.forEach(dia => {
        const cell = document.createElement('th');
        cell.textContent = dia;
        headerRow.appendChild(cell);
    });

    // Cria a primeira linha do calendário
    const primeiraSemana = table.insertRow();
    primeiraSemana.className = 'week';

    // Adiciona células vazias para preencher a primeira semana
    let primeiroDiaSemana = new Date(primeiroDiaDoMes);
    while (primeiroDiaSemana.getDay() > 0) {
        const cell = document.createElement('td');
        cell.textContent = '';
        primeiraSemana.appendChild(cell);
        primeiroDiaSemana.setDate(primeiroDiaSemana.getDate() - 1);
    }

    // Cria células para os dias do mês
    let data = new Date(primeiroDiaSemana);
    while (data <= ultimoDiaDoMes) {
        if (data.getDay() === 0) {
            // Cria uma nova linha para cada semana (domingo)
            const weekRow = table.insertRow();
            weekRow.className = 'week';
        }

        // Cria a célula para o dia atual
        const cell = document.createElement('td');
        cell.textContent = data.getDate();

        // Verifica se há dados para esse dia
        const dataFormatada = data.toISOString().split('T')[0];
        if (dadosPorDia.hasOwnProperty(dataFormatada)) {
            // Adicione estilos para mostrar renda e despesa nessa célula, se desejar
            cell.classList.add('com-dados');
        }

        // Adicione eventos de clique nas células (opcional)
        cell.addEventListener('click', () => {
            // Exibir os detalhes de renda e despesa para o dia clicado
            if (dadosPorDia.hasOwnProperty(dataFormatada)) {
                const detalhes = dadosPorDia[dataFormatada];
                alert(`Renda: ${detalhes.renda}\nDespesa: ${detalhes.despesa}`);
            } else {
                alert('Sem dados para este dia.');
            }
        });

        // Adicione a célula à linha da semana atual
        const semanaAtual = table.querySelector('.week:last-child');
        if (semanaAtual) {
            semanaAtual.appendChild(cell);
        }

        // Avança para o próximo dia
        data.setDate(data.getDate() + 1);
    }

    // Adicione a tabela ao elemento do calendário
    calendarElement.appendChild(table);
}





// Função para navegar para o mês anterior
function mesAnterior() {
    dataAtual.setMonth(dataAtual.getMonth() - 1);
    criarCalendario();
    calcularTotais();
}

// Função para navegar para o próximo mês
function mesSeguinte() {
    dataAtual.setMonth(dataAtual.getMonth() + 1);
    criarCalendario();
    calcularTotais();
}

// Cria o calendário e calcula os totais ao carregar a página
criarCalendario();
calcularTotais();

//--------------graficos---------------------------------->
function alterGrafic() {
    const element1 = document.querySelector(".myChart");
    const element2 = document.querySelector(".myChart2");

    const grafico1 = window.getComputedStyle(element1).display;
    const grafico2 = window.getComputedStyle(element2).display;

    if (grafico1 === 'block') {
        element1.style.display = 'none';
        element2.style.display = 'block';
        document.querySelector('.btn-chart').innerText = 'Renda';
    } else {
        element1.style.display = 'block';
        element2.style.display = 'none';
        document.querySelector('.btn-chart').innerText = 'Despesa';
    }
}




const arrRenda = inputArray
    .filter((valor) => valor.model === 'renda' && valor.value_money !== undefined)
    .map((valor) => parseFloat(valor.value_money.replace(/[￥]/g, '')));

const arrRendaData = inputArray
    .filter((valor) => valor.model === 'renda' && valor.data_register !== undefined)
    .map((valor) => valor.data_register.replace(/[￥,]/g, ''));


const arrDespesa = inputArray
    .filter((valor) => valor.model === 'despesa' && valor.value_money !== undefined)
    .map((valor) => parseFloat(valor.value_money.replace(/[￥]/g, '')));

const arrDespesaData = inputArray
    .filter((valor) => valor.model === 'despesa' && valor.data_register !== undefined)
    .map((valor) => valor.data_register.replace(/[￥,]/g, ''));

Chart.register(ChartDataLabels); //register do plugin


//graficos 01
var xValues = arrRendaData;
var yValues = arrRenda;
const barColors = yValues.map(() => getRandomColor());

new Chart("myChart", {
    type: "line",
    data: {
        labels: xValues,
        datasets: [{
            backgroundColor: barColors,
            borderColor: "lightgray",
            data: yValues,
        }]
    },
    options: {
        maintainAspectRatio: false,
        plugins: {
            datalabels: {
                //start datalabel
                color: "#000",
                anchor: "end",
                align: "end",
                offset: -10,
                font: {
                    size: 14,
                },
            },
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: "Rendas",
                padding: {
                    top: 10,
                    bottom: 30
                }
            },
        },

    }
});

//graficos 02
var xValues = arrDespesaData;
var yValues = arrDespesa;

new Chart("myChart2", {
    type: "line",
    data: {
        labels: xValues,
        datasets: [{
            backgroundColor: barColors,
            data: yValues
        }]
    },
    options: {
        maintainAspectRatio: false,
        plugins: {
            datalabels: {
                //start datalabel
                color: "#000",
                anchor: "end",
                align: "end",
                offset: -10,
                font: {
                    size: 14,
                },
            },
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: "Despesas",
                padding: {
                    top: 10,
                    bottom: 30
                }
            },
        },

    }
});

function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//graficos 03
var xValues = arrRendaData;
var yValues = arrRenda;

new Chart("myChart3", {
    type: "pie",
    data: {
        labels: xValues,
        datasets: [{
            backgroundColor: barColors,
            hoverOffset: 4,
            data: yValues
        }]
    },
    options: {
        maintainAspectRatio: false,
        plugins: {
            datalabels: null,
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: "Renda",
                padding: {
                    top: 10,
                    bottom: 30
                }
            },
        },

    }
});

//graficos 04
var xValues = arrDespesaData;
var yValues = arrDespesa;

new Chart("myChart4", {
    type: "pie",
    data: {
        labels: xValues,
        datasets: [{
            backgroundColor: barColors,
            hoverOffset: 4,
            data: yValues
        }]
    },
    options: {
        maintainAspectRatio: false,
        plugins: {
            datalabels: null,
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: "Despesas",
                padding: {
                    top: 10,
                    bottom: 30
                }
            },
        },

    }
});

document.querySelector('#btn-home').addEventListener('click', () => {
    location.href = "../kaikei.html";
})