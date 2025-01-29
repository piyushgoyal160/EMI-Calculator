import "./EMI-Calculator.css";
import { useState } from "react";

function calculateEMI(loanAmount, annualRateOfInterest, tenureInMonths) {
  let monthlyRate = annualRateOfInterest / 12 / 100;
  let emi =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths)) /
    (Math.pow(1 + monthlyRate, tenureInMonths) - 1);
  return emi.toFixed(2);
}

function calculateInterest(loanAmount, annualRateOfInterest, tenureInMonths) {
  let emi = calculateEMI(loanAmount, annualRateOfInterest, tenureInMonths);
  emi = parseFloat(emi);
  let totalRepayment = emi * tenureInMonths;
  let interestAmount = totalRepayment - loanAmount;
  return interestAmount.toFixed(2);
}

export default function EMICalculator() {
  const [emi, setEmi] = useState({
    loanAmount: 100000,
    tenure: 1,
    interestRate: 5,
  });

  const interestAmount = calculateInterest(
    emi.loanAmount,
    emi.interestRate,
    emi.tenure * 12
  );

  return (
    <div className="outer-div row shadow-md">
      <div className="left self-stretch">
        <div className="inner-left">
          <div className="flex flex-col justify-between h-full rounded-sm gap-2">
            <p>Monthly EMI Pay</p>
            <span>
              {calculateEMI(emi.loanAmount, emi.interestRate, emi.tenure * 12)}
            </span>
            <div>
              <div className="row">
                <span>Loan Amount</span>
                <span>{emi.loanAmount}</span>
              </div>
              <div className="row">
                <span>Interest Amount</span>
                <span>{interestAmount}</span>
              </div>
              <div className="row">
                <span>Total Amount</span>
                <span>{Number(emi.loanAmount) + Number(interestAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="right space-y-4">
        <div>
          <div className="row">
            <span>Loan Amount</span>
            <input
              className="border w-28 rounded-sm text-center px-2"
              value={emi?.loanAmount}
              onChange={(e) => setEmi({ ...emi, loanAmount: e.target.value })}
              type="number"
              min={100000}
              max={10000000}
              step={100000}
            />
          </div>
          <input
            className="w-full"
            value={emi?.loanAmount}
            onChange={(e) => setEmi({ ...emi, loanAmount: e.target.value })}
            type="range"
            min={100000}
            max={10000000}
            step={100000}
          />
        </div>
        <div>
          <div className="row">
            <span>Tenure</span>
            <input
              className="border w-28 rounded-sm text-center px-2"
              value={emi?.tenure}
              onChange={(e) => setEmi({ ...emi, tenure: e.target.value })}
              type="number"
              min={1}
              max={8}
              step={1}
            />
          </div>
          <input
            className="w-full"
            value={emi?.tenure}
            onChange={(e) => setEmi({ ...emi, tenure: e.target.value })}
            type="range"
            min={1}
            max={8}
            step={1}
          />
        </div>
        <div>
          <div className="row">
            <span>Interest Rate (% p.a.)</span>
            <input
              className="border w-28 rounded-sm text-center px-2"
              value={emi?.interestRate}
              onChange={(e) => setEmi({ ...emi, interestRate: e.target.value })}
              type="number"
              min={5}
              max={25}
              step={1}
            />
          </div>
          <input
            className="w-full"
            value={emi?.interestRate}
            onChange={(e) => setEmi({ ...emi, interestRate: e.target.value })}
            type="range"
            min={5}
            max={25}
            step={1}
          />
        </div>
      </div>
    </div>
  );
}
