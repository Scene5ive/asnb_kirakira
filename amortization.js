function amortizationCompound(
    loanAmount, 
    insuranceAmount, 
    interestRate, 
    tenure, 
    startDate, 
    investmentPeriod, 
    type){
    
    //To terms
    let terms = tenure*12

    //Total loan
    let totalLoan = loanAmount + insuranceAmount;

    //Calculate the per monthly interest rate
    let monthlyRate = interestRate/12;

    //Calculate the payment
    let payment = totalLoan * (monthlyRate/(1 - Math.pow(1 + monthlyRate,-terms)))

    let outstandingBalance = totalLoan;
    let cumulativePrincipal = 0;
    let calcDate = startDate;
    let monthCount = calcDate.getMonth();
    let modal = 0;
    let cashReturn = 0;
    let dividendAmount = 0;
    
    let no_of_month=[];
    let no_of_year=[];
    let investment_amount=[];
    let date_year=[];
    let date_month=[];
    let monthly_payment=[];
    let interest_paid=[];
    let cumulative_principal=[];
    let cumulative_principal_with_dividend = [];
    let outstanding_balance=[];
    let dividend_rate=[];
    let cash_return=[];
    let modal_spent=[];
    let result = [];
    let dividend_amount = [];

    //Loop the amortization calculation then adds to the return string
    for(let count = 0; count < terms; ++count){
        let month = count + 1;
        let interest = 0;
        let monthlyPrincipal = 0;
        let rate = 0;

        calcDate = new Date(calcDate.setMonth(monthCount));

        interest = outstandingBalance * monthlyRate;
        monthlyPrincipal = payment - interest;
        modal = modal + payment;
        outstandingBalance = outstandingBalance - monthlyPrincipal;
        monthCount = calcDate.getMonth() + 1;
        cumulativePrincipalWithDividend = loanAmount - outstandingBalance;
        cumulativePrincipal = cumulativePrincipal + monthlyPrincipal; 

        // console.log(calcDate.getFullYear());
        for(let i=0; i<dividendRate.length; i++){
            if(dividendRate[i].year === calcDate.getFullYear()){
                rate = dividendRate[i].rate;
                dividendAmount = dividendAmount + (loanAmount*rate)/12;
                //Adding the dividend amount into the investment
                if(calcDate.getMonth() === 11){
                    loanAmount = loanAmount + dividendAmount;
                }
                //Revert back divident amount to 0 and added only the divident predicted for next year
                if(calcDate.getMonth() === 0){
                    dividendAmount = (loanAmount*rate)/12;
                }
                break;
            };
        }
        
        cashReturn = cumulativePrincipalWithDividend + dividendAmount;

        if(type === 'year' && calcDate.getMonth() !== 11){
            continue;
        }

        //Tenure period (months)
        no_of_month.push(month),

        //Tenure period (years)
        no_of_year.push(calcDate.getFullYear()-startDate.getFullYear()+1),

        //Date (year)
        date_year.push(calcDate.getFullYear()),

        //Date (month)
        date_month.push(calcDate.getMonth()+1),

        //Modal
        modal_spent.push(modal.toFixed(2));

        //Cash return
        cash_return.push(cashReturn.toFixed(2));

        //Investment amount
        investment_amount.push(loanAmount.toFixed(2)),

        //Monthly payment amount
        monthly_payment.push(payment.toFixed(2)),

        //Paid interest amount
        interest_paid.push(interest.toFixed(2)),

        //principal values
        cumulative_principal.push(cumulativePrincipal.toFixed(2)),

        //Outstanding balance
        outstanding_balance.push(outstandingBalance.toFixed(2)),

        //Dividend rate 
        dividend_rate.push(rate)

        //Dividend amount
        dividend_amount.push(dividendAmount.toFixed(2));
    }

    result = {
        "no_of_year": no_of_year,
        "no_of_month": no_of_month,
        "date_year":date_year,
        "date_month":date_month,
        "modal_spent": modal_spent,
        "cash_return": cash_return,
        "investment_amount": investment_amount,
        "monthly_payment":monthly_payment,
        "interest_paid":interest_paid,
        "cumulative_principal":cumulative_principal,
        "cumulative_principal_with_dividend":cumulative_principal_with_dividend,
        "outstanding_balance":outstanding_balance,
        "dividend_rate": dividend_rate,
        "dividend_amount":dividend_amount
    };
    
    // console.log("data for chart: ", result);
    return result;
}