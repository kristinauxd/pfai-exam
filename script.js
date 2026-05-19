document.addEventListener('DOMContentLoaded', () => {
    // Inputs
    const revenueInput = document.getElementById('revenue');
    const aovInput = document.getElementById('aov');
    
    // Sliders
    const leadRateSlider = document.getElementById('lead-rate');
    const prospectRateSlider = document.getElementById('prospect-rate');
    const leadRateVal = document.getElementById('lead-rate-val');
    const prospectRateVal = document.getElementById('prospect-rate-val');

    // Outputs
    const valProspects = document.getElementById('val-prospects');
    const valLeads = document.getElementById('val-leads');
    const valCustomers = document.getElementById('val-customers');

    const pctProspects = document.getElementById('prospects-pct');
    const pctLeads = document.getElementById('leads-pct');
    const pctCustomers = document.getElementById('customers-pct');

    const barProspects = document.getElementById('bar-prospects');
    const barLeads = document.getElementById('bar-leads');
    const barCustomers = document.getElementById('bar-customers');

    // Chart Area
    const chartArea = document.getElementById('chart-area');

    function calculate() {
        const revenue = parseFloat(revenueInput.value) || 0;
        const aov = parseFloat(aovInput.value) || 1; // prevent div zero
        
        const leadResponseRate = parseFloat(leadRateSlider.value);
        const prospectResponseRate = parseFloat(prospectRateSlider.value);

        // Update Slider text
        leadRateVal.textContent = leadResponseRate.toFixed(2);
        prospectRateVal.textContent = prospectResponseRate.toFixed(2);

        // Formula 01: Customers = Revenue / AOV
        const customers = Math.round(revenue / aov);

        // Formula 02: Leads = Customers * 100 / Lead Response Rate
        const leads = Math.round((customers * 100) / leadResponseRate);

        // Formula 03: Prospects = Leads * 100 / Prospect Response Rate
        const prospects = Math.round((leads * 100) / prospectResponseRate);

        // Update DOM values
        valProspects.textContent = prospects;
        valLeads.textContent = leads;
        valCustomers.textContent = customers;

        // Calculate Percentages (Prospects is 100%)
        const pPct = 100;
        const lPct = prospects > 0 ? ((leads / prospects) * 100).toFixed(0) : 0;
        const cPct = prospects > 0 ? ((customers / prospects) * 100).toFixed(0) : 0;

        pctProspects.textContent = `${pPct}%`;
        pctLeads.textContent = `${lPct}%`;
        pctCustomers.textContent = `${cPct}%`;

        barProspects.style.width = `100%`;
        barLeads.style.width = `${lPct}%`;
        barCustomers.style.width = `${cPct}%`;

        renderChart(prospects, leads, customers);
    }

    function renderChart(totalProspects, totalLeads, totalCustomers) {
        chartArea.innerHTML = '';
        const months = 6;
        
        // Simple linear distribution simulation for the chart
        let currentP = 0, currentL = 0, currentC = 0;

        for(let i=1; i<=months; i++) {
            const row = document.createElement('div');
            row.className = 'chart-row';

            const label = document.createElement('div');
            label.className = 'chart-label';
            label.textContent = i;
            
            // Dummy distribution over months
            let monthP = Math.round(totalProspects * (i / months));
            let monthL = Math.round(totalLeads * (i / months));
            let monthC = Math.round(totalCustomers * (i / months));

            const barGroup = document.createElement('div');
            barGroup.className = 'chart-bar-group';

            const pBar = document.createElement('div');
            pBar.className = 'c-bar c-prospects';
            pBar.style.width = `${(monthP / Math.max(totalProspects, 1)) * 100}%`;

            const lBar = document.createElement('div');
            lBar.className = 'c-bar c-leads';
            lBar.style.width = `${(monthL / Math.max(totalProspects, 1)) * 100}%`;

            const cBar = document.createElement('div');
            cBar.className = 'c-bar c-customers';
            cBar.style.width = `${(monthC / Math.max(totalProspects, 1)) * 100}%`;

            barGroup.appendChild(pBar);
            barGroup.appendChild(lBar);
            barGroup.appendChild(cBar);

            row.appendChild(label);
            row.appendChild(barGroup);
            chartArea.appendChild(row);
        }
    }

    // Attach Listeners
    revenueInput.addEventListener('input', calculate);
    aovInput.addEventListener('input', calculate);
    leadRateSlider.addEventListener('input', calculate);
    prospectRateSlider.addEventListener('input', calculate);

    // Initial Calc
    calculate();
});