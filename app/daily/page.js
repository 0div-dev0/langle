import Navbar from "../component/Navbar"
import DailyGame from "../component/DailyGame"

export default function DailyPage() {
  return (
    <div className="min-h-screen game-bg">
      <Navbar />
      <main className="container-custom py-8">
        <DailyGame mode="daily" />
      </main>
    </div>
  )
}