
export default function Home() {
  return (
    <div className="flex h-screen justify-center items-center">
      <section className="grid bg-amber-700">
        <h1>Här ska du räkna dina bowling pöengar</h1>
        <div className="flex">
          <div className="grid">
            <p>1</p>
            <div className="flex">
              <h1>1</h1>
              <h1>2</h1>
            </div>
            <h1>Total</h1>
          </div>
        </div>
      </section>
    </div>
  );
}
