const distributionCards = document.getElementById('distribution-cards');
const addDistributionCardButton = document.getElementById('add-distribution-card');
let income = 10000;
let balance = 0;
let incomeDistributionFromStorage = JSON.parse(localStorage.getItem('incomeDistribution'))
let incomeDistribution = incomeDistributionFromStorage ?? [];

if (incomeDistribution.length == 0) {
    fetch('../examples.json')
        .then(response => response.json())
        .then(data => {
            incomeDistribution = data;
            loadIncomeDistribution();
        })
}

const saveIncomeDistribution = () => {
    localStorage.setItem('incomeDistribution', JSON.stringify(incomeDistribution));
}

const clearLocalStorage = () => {
    localStorage.removeItem('incomeDistribution');
}

const incomeInput = document.getElementById('income');
const incomeSummary = document.getElementById('income-summary');
incomeInput.addEventListener('input', e => {
    income = e.target.value;
    incomeSummary.textContent = e.target.value;
    loadIncomeDistribution();
})

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
            const { action, value } = result.value;
            let newBalance = balance;
            if (action === 'change') newBalance = value;
            if (action === 'add') newBalance += value;
            if (action === 'subtract') newBalance -= value;
            balance = newBalance;
            document.getElementById("balance").textContent = balance.toFixed(2);
            loadIncomeDistribution();
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

const updateDistributionCardsEvents = () => {
    const distributionCardsInputs = document.querySelectorAll('.distribution-card .input');
    distributionCardsInputs.forEach(input => {
        const adjustWidth = () => {
            input.style.width = '1ch';
            input.style.width = input.scrollWidth + 'px';
        };
        adjustWidth();

        const parent = input.closest('.distribution-card');
        const index = incomeDistribution.findIndex(distr => distr.id == parseInt(parent.id.replace(/\D/g, '')));

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
        };

        input.removeEventListener('input', handleInput);
        input.addEventListener('input', handleInput);
    });
    const distributionCardDeleteButtons = document.querySelectorAll('.remove-distribution-card');
    distributionCardDeleteButtons.forEach(button => {
        const parent = button.closest('.distribution-card');
        const index = incomeDistribution.findIndex(distr => distr.id == parseInt(parent.id.replace(/\D/g, '')));
        const handleDelete = e => {
            incomeDistribution.splice(index, 1);
            parent.remove();
        }
        button.removeEventListener('click', handleDelete);
        button.addEventListener('click', handleDelete);
    }
    );
};

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
    updateDistributionCardsEvents();
});

const loadIncomeDistribution = () => {
    let distributionCardsContainer = document.getElementById('distribution-cards');
    while (distributionCardsContainer.firstChild) {
        distributionCardsContainer.removeChild(distributionCardsContainer.firstChild);
    }
    incomeDistribution.forEach(distr => {
        let distributionCard = createDistributionCard(distr.id, distr.percentage, distr.title, distr.description);
        distributionCards.insertBefore(distributionCard, distributionCards.firstElementChild);
        updateDistributionCardsEvents();
    })
}

loadIncomeDistribution();


