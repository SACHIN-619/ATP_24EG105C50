import Header from './Header'
import Footer from './Footer'
import { Outlet} from 'react-router'

function RootLayout(){
    return(
        <div>
            <header />
                <div className=""></div>
             <Header />
             <Footer />
            <Outlet />
            
        </div>
    )
}

export default RootLayout