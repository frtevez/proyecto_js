const distributionCards = document.getElementById('distribution-cards');
const addDistributionCardButton = document.getElementById('add-distribution-card');
let income = 10000;
let balance = 1000000;
let incomeDistribution = [{}, {}];


const setBalance = () => {
    Swal.fire({
        title: 'Cambiar Balance Actual',
        html: `
          <div class="swal2-radio" style="text-align: center; margin-bottom: 0.75rem; font-size: 1rem;">
            <label><input type="radio" name="balance-action" value="change" checked> Establecer</label>
            <label><input type="radio" name="balance-action" value="add"> Agregar</label>
            <label><input type="radio" name="balance-action" value="subtract"> Sustraer</label>
          </div>
          <input type="number" id="balance-input" class="swal2-input" placeholder="Ingresa la cantidad..." style="background: var(--input-bg); color: var(--text); border: 1px solid var(--border);"/>
        `,
        background: '#1e1e1e',
        color: '#f1f1f1',
        confirmButtonColor: '#007bff',
        showCancelButton: true,
        cancelButtonColor: '#555',
        preConfirm: () => {
            const radios = document.getElementsByName('balance-action');
            let action = 'change';
            for (const radio of radios) {
                if (radio.checked) {
                    action = radio.value;
                    break;
                }
            }
            const value = parseFloat(document.getElementById('balance-input').value);
            if (isNaN(value)) {
                Swal.showValidationMessage('Por favor, ingresa un número válido.');
                return false;
            }
            return { action, value };
        }
    }).then(result => {
        if (result.isConfirmed && result.value) {
            const currentBalance = parseFloat(document.getElementById("balance").textContent);
            const { action, value } = result.value;
            let newBalance = currentBalance;
            if (action === 'change') newBalance = value;
            if (action === 'add') newBalance += value;
            if (action === 'subtract') newBalance -= value;
            document.getElementById("balance").textContent = newBalance.toFixed(2);
        }
    });
}
const setBalanceBtn = document.getElementsByClassName('set-balance-btn')[0];
setBalanceBtn.addEventListener('click', e => setBalance())

const distributionCardsInputs = document.querySelectorAll('.distribution-card .input');
distributionCardsInputs.forEach(input => {
    const adjustWidth = () => {
        input.style.width = '1ch';
        input.style.width = input.scrollWidth + 'px';
    };
    adjustWidth();

    const index = parseInt(input.closest('.distribution-card').id.replace(/\D/g, ''));
    input.addEventListener('input', e => {
        adjustWidth();
        const allowedCharacters = /[^a-zA-Z0-9 .,:%()-]/g;
        // Por el momento no se me ocurrio una forma mejor de crear un input con wrap que no sea un div con
        // contenteditable, y esto tiene ciertos bugs. Por cuestión de tiempo, lo dejo como está.
        if (input.tagName === 'DIV') {
            if (e.data === ' ') {
                e.preventDefault();
                incomeDistribution[index].description = input.textContent;
            }
            else {
                input.textContent = input.textContent.replace(allowedCharacters, '');
                incomeDistribution[index].description = input.textContent;
            };
        }
        else if (input.type === 'text') {
            input.value = input.value.replace(allowedCharacters, '');
            incomeDistribution[index].title = input.value;
        }
        else if (input.type === 'number') {
            input.value = input.value
            input.value = Math.max(0, Math.min(100, input.value));

            // let percentagesArray = incomeDistribution.map(distr => distr.percentage)
            // let percentagesSum = 0;
            // percentagesArray.forEach((percentage, idx)=>{
            //     if (idx == index) return;
            //     percentagesSum += parseInt(percentage);
            // })

            let percentagesSum = incomeDistribution.reduce((sum, distr, idx) => {
                return idx === index ? sum : sum + parseInt(distr.percentage);
            }, 0);

            if ((percentagesSum + parseInt(input.value)) > 100) {
                input.value = 100 - percentagesSum;
            }
            incomeDistribution[index].percentage = input.value;

            console.log(incomeDistribution);
        }

    });
});


const createDistributionCard = () => {
    let distributionCard = document.createElement("div");
    const index = incomeDistribution.length;
    const id = `d-card-${index}`;
    distributionCard.className = 'distribution-card';
    distributionCard.id = id;

    distributionCard.innerHTML = `
        <div class="distribution-card-header">
            <div>
              <div class="distribution-card-title">
                <input
                  class="input"
                  type="number"
                  max="100"
                  min="0"
                  class="input"
                  value="0"
                />% –
                <input
                  class="input"
                  type="text"
                  value="Título"
                  maxlength="45"
                />
              </div>
              <div class="distribution-card-description">
                <div class="input" contenteditable="true" >
                  Describe esta asignación.
                </div>
              </div>
              <div class="distribution-card-values">
                Calculated: $0.00 / 0.00
              </div>
            </div>
            <button class="remove-distribution-card"></button>
        </div>
    `

    const thisCardPercentageSetterForm = document.createElement('form');
    thisCardPercentageSetterForm.id = `percentage-form-${id}`;
    thisCardPercentageSetterForm.innerHTML = `
    <input type="number" placeholder="0" step="0.1" max=100 name="percentage">%
    <input type="submit" value="✔">
    `;

    incomeDistribution[index] = 0;

    let thisCardPercentageDisplay = document.createElement('div');
    thisCardPercentageDisplay.className = "distribution-card-values";
    const updatePercentageDisplay = () => {
        const formattedIncome = (income * incomeDistribution[index] / 100).toLocaleString('es-ES', { style: 'currency', currency: 'USD' });
        const formattedBalance = (balance * incomeDistribution[index] / 100).toLocaleString('es-ES', { style: 'currency', currency: 'USD' });

        thisCardPercentageDisplay.innerHTML = `
        <p class="distribution-card-percentage">
        ${incomeDistribution[index]}%
        </p>
        <p class="distribution-card-income-x-percentage">
        Ingreso: ${formattedIncome}
        </p>
        <p class="distribution-card-balance-x-percentage">
        Balance: ${formattedBalance}
        </p>
    `;
    };
    updatePercentageDisplay();
    return distributionCard;
};

addDistributionCardButton.addEventListener('click', e => {
    let distributionCard = createDistributionCard();
    distributionCards.insertBefore(distributionCard, distributionCards.firstElementChild);
});