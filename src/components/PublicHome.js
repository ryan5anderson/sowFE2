import { Link } from 'react-router-dom'

const Public = () => {
    const content = (
        <section className="public">
            <header>
                <h1>Welcome to <span className="nowrap">SOW</span></h1>
            </header>
            <main className="public__main">
                <p>Mock website for Statemnet of Work editor Proof of Concept.</p>
                <br />
                <p>Owner: Ryan Anderson</p>
            </main>
            <footer>
                <Link to="/login">Employee Login</Link>
            </footer>
        </section>

    )
    return content
}
export default Public