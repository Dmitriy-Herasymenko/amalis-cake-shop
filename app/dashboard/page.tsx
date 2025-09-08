import CakesChart from "./components/cakesChart";

export default function DashboardPage() {

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Ласкаво просимо в адмінку!</h1>
      <p>Виберіть розділ з бокового меню для керування товарами та замовленнями.</p>
      <CakesChart />
    </>
  );
}
