const Header = () => {

    return (
        <header class="bg-gray-800 text-white">
            <div class="container mx-auto flex justify-between items-center py-4 px-6">

                <p class="text-2xl font-bold">Crud App</p>

                <nav class="hidden md:flex space-x-6">
                    <p class="hover:text-gray-300">Home</p>
                    <p class="hover:text-gray-300">About</p>
                    <p class="hover:text-gray-300">Services</p>
                    <p class="hover:text-gray-300">Contact</p>
                </nav>

                <button class="md:hidden text-gray-300 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>


            </div>
        </header>
    )
}


export default Header