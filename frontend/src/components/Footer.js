import visa from '../assets/visa_icon.png'
import mastercard from '../assets/mastercard_icon.png'
import american from '../assets/american_express_icon.png'
import pix from '../assets/pix_icon.png'


export default function Footer() {
    return (
        <footer class="bg-white rounded-lg shadow">
            <div class="container mx-auto">
                <div class="flex justify-between">
                    <div class="flex flex-col">
                        <h1 class="text-lg font-semibold mb-4">Payment methods</h1>
                        <div class="flex flex-row justify-center gap-6">
                            <img src={american} alt="american" class="w-1/4" />
                            <img src={mastercard} alt="mastercard" class="w-1/4" />
                            <img src={visa} alt="visa" class="w-1/4" />
                            <img src={pix} alt="pix" class="w-1/4" />
                        </div>
                    </div>
                    <div class="w-1/2">
                    </div>
                </div>
            </div>

            <div class="flex justify-between py-4 mt-4" style={{ backgroundColor: '#e6e6e6' }}>
                <div className="container mx-auto flex flex-col md:flex-row">
                    <div class="flex flex-col">
                        <p className="font-semibold">Customer Service</p>
                        <ul>
                            <li>
                                <a href="#" class="mr-4 hover:underline md:mr-6 ">Contact us</a>
                            </li>
                            <li>
                                <a href="#" class="mr-4 hover:underline md:mr-6">FAQ's</a>
                            </li>
                            <li>
                                <a href="#" class="mr-4 hover:underline md:mr-6">Orders and delivery</a>
                            </li>
                            <li>
                                <a href="#" class="hover:underline">Returns and refunds</a>
                            </li>
                        </ul>
                    </div>
                    <div class="flex flex-col">
                        <p className="font-semibold">About us</p>
                        <ul>
                            <li>
                                <a href="#" class="mr-4 hover:underline md:mr-6 ">About us</a>
                            </li>
                            <li>
                                <a href="#" class="mr-4 hover:underline md:mr-6 ">Careers</a>
                            </li>
                        </ul>
                    </div>
                    <div class="flex flex-col">
                        <p className="font-semibold">Discounts and membership</p>
                        <ul>
                            <li>
                                <a href="#" class="mr-4 hover:underline md:mr-6 ">Affiliate program</a>
                            </li>
                            <li>
                                <a href="#" class="mr-4 hover:underline md:mr-6 ">Refer a friend</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="rounded" style={{ backgroundColor: '#e6e6e6' }}>
                <div className="mx-auto container">
                    <ul class="flex flex-wrap items-center mt-3 text-sm font-medium md:mt-0">
                        <li>
                            <a href="#" class="mr-4 hover:underline md:mr-6 ">About</a>
                        </li>
                        <li>
                            <a href="#" class="mr-4 hover:underline md:mr-6">Privacy Policy</a>
                        </li>
                        <li>
                            <a href="#" class="mr-4 hover:underline md:mr-6">Licensing</a>
                        </li>
                        <li>
                            <a href="#" class="hover:underline">Contact</a>
                        </li>
                    </ul>
                    <span class="text-sm">
                        © 2023 <a href="https://flowbite.com/" class="hover:underline">E-commerce</a>. All Rights Reserved.
                    </span>
                </div>
            </div>


        </footer >
    )
}
