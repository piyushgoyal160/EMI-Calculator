import { Slider } from "@mui/material";
import "./Trial.css";
import { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

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

function formatNumber(number) {
  const numberWithoutDecimals = Math.floor(Number(number));
  return numberWithoutDecimals.toLocaleString("en-IN");
}

const options = {
  cutout: "70%",
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      enabled: true,
      displayColors: false,
      callbacks: {
        title: function (tooltipItem) {
          const label = tooltipItem[0].label;
          const value = tooltipItem[0].raw;
          return `${label} : ${formatNumber(value)}`;
        },
        label: function (tooltipItem) {
          return "";
        },
      },
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      titleColor: "white",
      bodyColor: "white",
      bodyFont: {
        size: 14,
        weight: "bold",
      },
      padding: 10,
    },
    legend: {
      display: false,
    },
  },
};

export default function Trial() {
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

  const data = {
    labels: ["Total Amount", "Interest Amount"],
    datasets: [
      {
        data: [Number(emi.loanAmount) + Number(interestAmount), interestAmount],
        backgroundColor: ["#121b5b", "#484848"],
        borderColor: ["#959595"],
        borderWidth: 1,
      },
    ],
  };

  const handleInputChange = (e, field) => {
    let value = e.target.value.replace(/,/g, "");

    // For blank inputs, just allow empty strings
    if (value === "") {
      setEmi({ ...emi, [field]: "" });
      return;
    }

    if (isNaN(value)) {
      return;
    }

    value = parseFloat(value);

    // Loan amount validation
    if (field === "loanAmount") {
      value = Math.min(value, 10000000);
    }

    // Tenure validation (1 to 8 years)
    if (field === "tenure") {
      value = Math.min(value, 8);
    }

    // Interest rate validation (5% to 25%)
    if (field === "interestRate") {
      value = Math.min(value, 25);
    }

    setEmi({ ...emi, [field]: value });
  };

  return (
    <div className="outer-div row shadow-md flex-col md:flex-row">
      <div className="left shadow-md">
        <div className="inner-left shadow-md">
          <div className="flex flex-col justify-between h-full rounded-sm gap-2">
            <p>Monthly EMI Pay</p>
            <span className="amount">
              ₹{" "}
              {formatNumber(
                calculateEMI(emi.loanAmount, emi.interestRate, emi.tenure * 12)
              )}
            </span>
            <div className="size-40 object-fill mx-auto">
              <Doughnut data={data} options={options} />
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="row row-left">
                  <span>Loan Amount</span>
                  <span>₹ {formatNumber(emi.loanAmount)}</span>
                </div>
                <div className="row row-left">
                  <span>Interest Amount</span>
                  <span className="text-[#808080]">
                    + ₹ {formatNumber(interestAmount)}
                  </span>
                </div>
              </div>
              <div className="row row-left border-t border-[#e0e0e0] py-4">
                <span className="text-[#121B5B]">Total Amount</span>
                <span>
                  ₹{" "}
                  {formatNumber(
                    Number(emi.loanAmount) + Number(interestAmount)
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="right space-y-4">
        <div className="border-b border-[#e0e0e0] pb-5">
          <div className="row row-right">
            <span>Loan Amount</span>
            <input
              className="border w-28 rounded-sm text-center px-2"
              value={
                emi?.loanAmount === "" ? "" : formatNumber(emi?.loanAmount)
              }
              onChange={(e) => handleInputChange(e, "loanAmount")}
              onBlur={() =>
                emi.loanAmount === "" && setEmi({ ...emi, loanAmount: "" })
              }
              onFocus={() =>
                setEmi({ ...emi, loanAmount: emi.loanAmount.replace(/,/g, "") })
              }
              type="text"
              min={100000}
              max={10000000}
              step={100000}
            />
          </div>
          <input
            className="w-full"
            value={emi?.loanAmount === "" ? "" : emi?.loanAmount}
            onChange={(e) => handleInputChange(e, "loanAmount")}
            type="range"
            min={100000}
            max={10000000}
            step={100000}
          />
          {/* <Slider
            defaultValue={50}
            aria-label="Default"
            valueLabelDisplay="auto"
            className="w-full"
            value={emi?.loanAmount}
            onChange={(e) => handleInputChange(e, "loanAmount")}
            // type="range"
            min={100000}
            max={10000000}
            step={100000}
          /> */}
          <div className="flex justify-between">
            <div>₹ 1 Lakh</div>
            <div>₹ 1 Cr</div>
          </div>
        </div>
        <div className="border-b border-[#e0e0e0] pb-5">
          <div className="row row-right">
            <span>Tenure</span>
            <input
              className="border w-28 rounded-sm text-center px-2"
              value={emi?.tenure}
              onChange={(e) => handleInputChange(e, "tenure")}
              type="number"
              min={1}
              max={8}
              step={1}
            />
          </div>
          <input
            className="w-full"
            value={emi?.tenure}
            onChange={(e) => handleInputChange(e, "tenure")}
            type="range"
            min={1}
            max={8}
            step={1}
          />
          <div className="flex justify-between">
            <div>1 Year</div>
            <div>8 Year</div>
          </div>
        </div>
        <div className="border-b border-[#e0e0e0] pb-5">
          <div className="row row-right">
            <span>Interest Rate (% p.a.)</span>
            <input
              className="border w-28 rounded-sm text-center px-2"
              value={emi?.interestRate}
              onChange={(e) => handleInputChange(e, "interestRate")}
              type="number"
              min={5}
              max={25}
              step={1}
            />
          </div>
          <input
            className="w-full"
            value={emi?.interestRate}
            onChange={(e) => handleInputChange(e, "interestRate")}
            type="range"
            min={5}
            max={25}
            step={0.5}
          />
          {/* <Slider
            defaultValue={50}
            aria-label="Default"
            valueLabelDisplay="auto"
            className="w-full"
            value={emi?.interestRate}
            onChange={(e) => handleInputChange(e, "interestRate")}
            type="range"
            min={5}
            max={25}
            step={0.5}
          /> */}
          <div className="flex justify-between">
            <div>5%</div>
            <div>25%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
