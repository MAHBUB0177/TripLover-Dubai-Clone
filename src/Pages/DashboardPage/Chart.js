import { Bar } from "react-chartjs-2";

const Chart = ({ chartData }) => {
  return (
    <div>
      <Bar
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Top 5",
            },
            legend: {
              display: false,
              position: "bottom",
            },
          },
        }}
      />
    </div>
  );
};

export default Chart;
// const Invoice = () => {
//     const fetchPrices = async () => {
//         const res = await fetch("https://api.coincap.io/v2/assets/?limit=5")
//         const data = await res.json()
//       }
//       const x =  fetchPrices();

//     return (
//         <>
//         <h3>sdflssslkl</h3>
//         </>
//     )
// };

// export default Invoice;
