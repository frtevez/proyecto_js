const distributionCardGrid = document.getElementById('distribution-card-grid');
const addDistributionCardButton = document.getElementById('add-distribution-card');
let income = 10000;
let balance = 1000000;
let incomeDistribution = [];


const createDistributionCard = () => {
    let distributionCard = document.createElement("article");
    const index = incomeDistribution.length;
    const id = `d-card-${index}`;

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


    distributionCard.className = "distribution-card";
    distributionCard.id = `distribution-card-${incomeDistribution.length}`;
    distributionCard.innerHTML = `
    <div>
        <input type="text" value="Distribución ${index}">
        <div id="${id}">
        </div>
        <p>desc</p>
    </div>
    `;
    // me tomé la libertad de usar setTimeout porque sino hay problemas de referencias a elementos del DOM que todavía no existen.
    setTimeout(() => {
        const thisCard = document.getElementById(id);

        thisCard.appendChild(thisCardPercentageDisplay);

        thisCardPercentageSetterForm.onsubmit = e => {
            e.preventDefault();
            thisCard.replaceChild(thisCardPercentageDisplay, thisCardPercentageSetterForm);
            const percentage = parseFloat(thisCardPercentageSetterForm.elements["percentage"].value);
            let distributionSum = incomeDistribution.reduce((acc, cv) => acc + cv, 0)

            if (distributionSum + percentage > 100.0 || isNaN(percentage)) {
                thisCardPercentageSetterForm.elements["percentage"].value = "0";
                return
            };
            incomeDistribution[index] = percentage;
            updatePercentageDisplay();
        };

        thisCard.addEventListener('click', e => {
            if (e.currentTarget.contains(thisCardPercentageSetterForm)) return;
            e.currentTarget.replaceChild(thisCardPercentageSetterForm, thisCardPercentageDisplay)
        });
    }, 0);

    return distributionCard;
};

addDistributionCardButton.addEventListener('click', e => {
    let distributionCard = createDistributionCard();
    distributionCardGrid.insertBefore(distributionCard, distributionCardGrid.lastElementChild);
});