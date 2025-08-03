import React from 'react'

const Header = () => {

    return (
        <header class="bg-gray-800 text-white">
            <div class="container mx-auto flex justify-between items-center py-4 px-6">

                <a href="#" class="text-2xl font-bold">Simple Crud App</a>

                <nav class="hidden md:flex space-x-6">
                    <a href="#" class="hover:text-gray-300">Home</a>
                    <a href="#" class="hover:text-gray-300">About</a>
                    <a href="#" class="hover:text-gray-300">Services</a>
                    <a href="#" class="hover:text-gray-300">Contact</a>
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