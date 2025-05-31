const distributionCards = document.getElementById('distribution-cards');
const addDistributionCardButton = document.getElementById('add-distribution-card');
let income = 10000;
let balance = 1000000;
let incomeDistribution = JSON.parse(localStorage.getItem('incomeDistribution')) ?? [
    { 'id': 0, 'percentage': 20, 'title': 'Inversiones', 'description': 'Asignación para distintas vías de inversión.' },
    { 'id': 3, 'percentage': 30, 'title': 'Ahorros', 'description': 'Reserva para objetivos y necesidades futuras.' }
];

const saveIncomeDistribution = () => {
    localStorage.setItem('incomeDistribution', JSON.stringify(incomeDistribution));
}

const clearLocalStorage = () => {
    localStorage.removeItem('incomeDistribution');
}

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

const getCalculatedIncomeAndBalance = (parent, percentage) => {
    const formattedIncome = (income * (percentage / 100)).toLocaleString('es-ES', { style: 'currency', currency: 'USD' });
    const formattedBalance = (balance * (percentage / 100)).toLocaleString('es-ES', { style: 'currency', currency: 'USD' });
    let calculatedIncomeNode = parent.getElementsByClassName('calculated-income')[0];
    let calculatedBalanceNode = parent.getElementsByClassName('calculated-balance')[0];
    calculatedIncomeNode.textContent = formattedIncome;
    calculatedBalanceNode.textContent = formattedBalance;
}

const updateDistributionCardsInputs = () => {
    const distributionCardsInputs = document.querySelectorAll('.distribution-card .input');
    distributionCardsInputs.forEach(input => {
        const adjustWidth = () => {
            input.style.width = '1ch';
            input.style.width = input.scrollWidth + 'px';
        };
        adjustWidth();

        const parent = input.closest('.distribution-card');
        const index = parseInt(parent.id.replace(/\D/g, ''));

        const handleInput = (e) => {
            adjustWidth();
            const allowedCharacters = /[^a-zA-Z0-9 .,:%()-]/g;

            if (input.tagName === 'DIV') {
                if (e.data === ' ')
                    e.preventDefault();
                else
                    input.textContent = input.textContent.replace(allowedCharacters, '');
                incomeDistribution[index].description = input.textContent;

            } else if (input.type === 'text') {
                input.value = input.value.replace(allowedCharacters, '');
                incomeDistribution[index].title = input.value;

            } else if (input.type === 'number') {
                input.value = Math.max(0, Math.min(100, input.value));

                let percentagesSum = incomeDistribution.reduce((sum, distr, idx) => {
                    return idx === index ? sum : sum + parseInt(distr.percentage);
                }, 0);

                if ((percentagesSum + parseInt(input.value)) > 100) {
                    input.value = 100 - percentagesSum;
                }
                incomeDistribution[index].percentage = input.value;

                getCalculatedIncomeAndBalance(parent, input.value)

            }
            console.log(incomeDistribution);
        };

        input.removeEventListener('input', handleInput);
        input.addEventListener('input', handleInput);
    });
}

const getSmallestUnusedNumber = (array) => {
    for (let i = 0; i <= array.length; i++) {
        if (!array.includes(i)) {
            return i;
        }
    }

};

const createDistributionCard = (storedId = null, percentage = 10, title = "Título", description = 'Describe esta asignación.') => {
    let distributionCard = document.createElement("div");
    const id = storedId ?? getSmallestUnusedNumber(incomeDistribution.map(distr => distr.id));
    const elementId = `d-card-${id}`;
    distributionCard.className = 'distribution-card';
    distributionCard.id = elementId;

    if (storedId === null) {
        incomeDistribution.splice(id, 0, {
            'id': id,
            'percentage': percentage,
            'title': title,
            'description': description,
        })
    };


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
                  value="${percentage}"
                />% –
                <input
                  class="input"
                  type="text"
                  value="${title}"
                  maxlength="45"
                />
              </div>
              <div class="distribution-card-description">
                <div class="input" contenteditable="true" >
                  ${description}
                </div>
              </div>
              <div class="distribution-card-values">
                Calculated: <span class="calculated-income">$0.00</span> / <span class="calculated-balance">0.00</span>
              </div>
            </div>
            <button class="remove-distribution-card"></button>
        </div>
    `
    //Revisés lo de DOMContentLoaded pero no funcionó y no tengo mucho tiempo.
    setTimeout(() => getCalculatedIncomeAndBalance(distributionCard, percentage), 0)

    let thisCardPercentageDisplay = document.createElement('div');
    thisCardPercentageDisplay.className = "distribution-card-values";

    return distributionCard;
};


addDistributionCardButton.addEventListener('click', e => {
    let distributionCard = createDistributionCard();
    distributionCards.insertBefore(distributionCard, distributionCards.firstElementChild);
    updateDistributionCardsInputs();
});

const loadIncomeDistribution = () => {
    incomeDistribution.forEach(distr => {
        let distributionCard = createDistributionCard(distr.id, distr.percentage, distr.title, distr.description);
        distributionCards.insertBefore(distributionCard, distributionCards.firstElementChild);
        updateDistributionCardsInputs();
    })
}

loadIncomeDistribution();

