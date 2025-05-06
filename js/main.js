const mainContent = document.getElementById('main');
const addDistributionCardButton = document.getElementById('add-distribution-card');
let income = {
    monthly: 0,
    yearly: 0,
};
let incomeDistribution = [];


const createDistributionCard = () => {
    let distributionCard = document.createElement("article");
    const index = incomeDistribution.length;
    const id = `d-card-${index}`;

    const percentageForm = document.createElement('form');
    percentageForm.id = `percentage-form-${id}`;
    percentageForm.innerHTML = `
    <input type="number" placeholder="0" step="0.1" max=100 name="percentage">%
    <input type="submit" value="✔">
    `;

    incomeDistribution[index] = 0;

    let percentageDisplay = document.createElement('p');
    const updatePercentageDisplay = () => percentageDisplay.innerText = `${incomeDistribution[index]}%
    Ingreso: ${10450 * incomeDistribution[index] / 100}
    `;
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

        thisCard.appendChild(percentageDisplay);

        percentageForm.onsubmit = e => {
            e.preventDefault();
            thisCard.replaceChild(percentageDisplay, percentageForm);
            const percentage = parseFloat(percentageForm.elements["percentage"].value);
            let distributionSum = incomeDistribution.reduce((acc, cv) => acc + cv, 0)

            if (distributionSum + percentage > 100.0) {
                percentageForm.elements["percentage"].value = "0";
                return
            };
            incomeDistribution[index] = percentage;
            updatePercentageDisplay();
        };

        thisCard.addEventListener('click', e => {
            if (e.currentTarget.contains(percentageForm)) return;
            e.currentTarget.replaceChild(percentageForm, percentageDisplay)
        });
    }, 0);

    return distributionCard;
};

addDistributionCardButton.addEventListener('click', e => {
    let distributionCard = createDistributionCard();
    mainContent.insertBefore(distributionCard, mainContent.lastElementChild);
});