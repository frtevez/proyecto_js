let incomeAllocations = [];

const validateNumberPrompt = submittedPrompt => {
    while (isNaN(submittedPrompt)){
        submittedPrompt = prompt('No puede ingresar otra cosa que no sea un número.')
    };
    return submittedPrompt;
};

const requestIncomeAllocationsPercentages = () => {
    let remainingPercentage = 1;
    let percentageInput;
    let incomeAllocationsPercentages = [];

    while (remainingPercentage > 0) {
        percentageInput = parseInt(prompt(
            'Por favor, ingrese un porcentaje (0-100) que desearía dedicar de sus ingresos a una categoría de gastos:')) / 100;
        while (
            percentageInput > 1
            || (remainingPercentage - percentageInput) < 0
            || percentageInput < 0
            || isNaN(percentageInput)
        ) {
            percentageInput = parseInt(prompt(
                `El porcentaje solicitado debe ser un número del 0 al 100 positivo y no exceder el porcentaje disponible (actualmente ${remainingPercentage * 100}), por favor ingrese otro número:`))
                / 100;
        };

        incomeAllocations.push({ percentage: percentageInput })
        remainingPercentage -= percentageInput;
        alert(`Porcentaje Restante: ${remainingPercentage * 100}%`)
    };

    // incomeAllocations.forEach(allocation => incomeAllocationsPercentages.push((allocation.percentage * 100).toString() + '%'));

    // Para cumplir con el uso de lo visto en clase, hice lo mismo que hubiera hecho con forEach con un for común.
    for (let i = 0; i < incomeAllocations.length; i++) {
        const allocation = incomeAllocations[i];
        incomeAllocationsPercentages.push((allocation.percentage * 100).toString() + '%')
    }
    alert(`100% alcanzado. Sus gastos se dividirán en: ${incomeAllocationsPercentages.join(' + ')}`)
};

const requestIncomeAllocationsNames = () => {
    alert('Asígnele un nombre a cada porcentaje, de acuerdo a su propósito.')
    incomeDistribution = [];
    incomeAllocations.forEach(allocation => {
        allocation.category = prompt(`¿A qué le dedicará el ${allocation.percentage * 100}% de su ingreso?`);
        while (allocation.category == '' || allocation.category == null) {
            allocation.category = prompt(`Es necesario que asigne categorías a sus gastos, ¿a qué le dedicará el ${allocation.percentage * 100}% de su ingreso?`);
        };
        incomeDistribution.push(`${allocation.category}: ${allocation.percentage * 100}%`);
    });
    alert(`¡Muy bien! Esta es su distribución de ingresos: \n${incomeDistribution.join('\n')}`);
};

const requestIncome = () => {
    let balance = validateNumberPrompt(prompt('Ahora por favor ingrese su balance (dinero total) actual:'));
    let monthlyIncome = validateNumberPrompt(prompt('Ingrese su saldo mensual:'));
    let appliedIncomeDistribution = [];
    incomeAllocations.forEach(allocation => appliedIncomeDistribution.push(`${allocation.category} (${allocation.percentage*100}%): $${allocation.percentage * balance} disponible + $${allocation.percentage * monthlyIncome} mensual`));
    alert(`Esta es la distribución de su dinero:\n${appliedIncomeDistribution.join('\n')}`)
};

requestIncomeAllocationsPercentages();
requestIncomeAllocationsNames();
requestIncome();