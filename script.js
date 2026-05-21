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
    const xAxis = document.getElementById('x-axis');
    const tooltip = document.getElementById('chart-tooltip');

    // Number animation state
    let targetProspects = 0, targetLeads = 0, targetCustomers = 0;
    
    // Animate numbers smoothly
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function calculate() {
        const revenue = parseFloat(revenueInput.value) || 0;
        const aov = parseFloat(aovInput.value) || 1; // prevent div zero
        
        const leadResponseRate = parseFloat(leadRateSlider.value);
        const prospectResponseRate = parseFloat(prospectRateSlider.value);

        // Update Slider text
        leadRateVal.textContent = leadResponseRate.toFixed(2);
        prospectRateVal.textContent = prospectResponseRate.toFixed(2);

        // Calculate targets
        const customers = Math.round(revenue / aov);
        const leads = Math.round((customers * 100) / leadResponseRate);
        const prospects = Math.round((leads * 100) / prospectResponseRate);

        // Animate numbers if they changed
        if (customers !== targetCustomers) animateValue(valCustomers, targetCustomers, customers, 500);
        if (leads !== targetLeads) animateValue(valLeads, targetLeads, leads, 500);
        if (prospects !== targetProspects) animateValue(valProspects, targetProspects, prospects, 500);

        targetCustomers = customers;
        targetLeads = leads;
        targetProspects = prospects;

        // Calculate Percentages (Prospects is 100%)
        const pPct = 100;
        const lPct = prospects > 0 ? ((leads / prospects) * 100).toFixed(0) : 0;
        const cPct = prospects > 0 ? ((customers / prospects) * 100).toFixed(0) : 0;

        pctProspects.textContent = `${pPct}%`;
        pctLeads.textContent = `${lPct}%`;
        pctCustomers.textContent = `${cPct}%`;

        // Update main progress bars smoothly via CSS
        barProspects.style.width = `100%`;
        barLeads.style.width = `${lPct}%`;
        barCustomers.style.width = `${cPct}%`;

        renderChart(prospects, leads, customers);
    }

    function renderChart(totalProspects, totalLeads, totalCustomers) {
        chartArea.innerHTML = '';
        const months = 6;
        
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
            // Defer width to trigger transition
            setTimeout(() => { pBar.style.width = `${(monthP / Math.max(totalProspects, 1)) * 100}%`; }, 10);

            const lBar = document.createElement('div');
            lBar.className = 'c-bar c-leads';
            setTimeout(() => { lBar.style.width = `${(monthL / Math.max(totalProspects, 1)) * 100}%`; }, 10);

            const cBar = document.createElement('div');
            cBar.className = 'c-bar c-customers';
            setTimeout(() => { cBar.style.width = `${(monthC / Math.max(totalProspects, 1)) * 100}%`; }, 10);

            // Microinteractions Tooltip Events
            barGroup.addEventListener('mouseenter', () => {
                tooltip.classList.add('active');
                tooltip.innerHTML = `<strong>Month #${i}</strong><hr style="border-color: rgba(255,255,255,0.1); margin: 5px 0;">Prospects: <span style="color: #cbd5e1">${monthP}</span><br>Leads: <span style="color: #cbd5e1">${monthL}</span><br>Customers: <span style="color: #cbd5e1">${monthC}</span>`;
            });

            barGroup.addEventListener('mousemove', (e) => {
                tooltip.style.left = e.clientX + 20 + 'px';
                tooltip.style.top = e.clientY + 'px';
            });

            barGroup.addEventListener('mouseleave', () => {
                tooltip.classList.remove('active');
            });

            barGroup.appendChild(pBar);
            barGroup.appendChild(lBar);
            barGroup.appendChild(cBar);

            row.appendChild(label);
            row.appendChild(barGroup);
            chartArea.appendChild(row);
        }

        // Render X-axis smoothly
        if (xAxis) {
            xAxis.innerHTML = '';
            const segments = 6;
            const rawStep = totalProspects / segments;
            let step = Math.ceil(rawStep / 10) * 10;
            if (step === 0) step = 10;

            for(let i=0; i<=segments; i++) {
                const labelSpan = document.createElement('span');
                labelSpan.textContent = `${i * step}`;
                xAxis.appendChild(labelSpan);
            }
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
