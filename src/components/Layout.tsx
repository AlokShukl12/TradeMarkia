import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const navigation = [
  { name: 'Trademarks', href: '#', current: true },
  { name: 'Patents', href: '#', current: false },
  { name: 'Copyrights', href: '#', current: false },
  { name: 'Legal Services', href: '#', current: false },
];

const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Disclosure as="nav" className="bg-[#232f3e]">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-8 w-auto"
                        src="/logo.png"
                        alt="Your Company"
                      />
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? 'bg-[#485769] text-white'
                                : 'text-gray-300 hover:bg-[#485769] hover:text-white',
                              'rounded-md px-3 py-2 text-sm font-medium'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      {/* Search button */}
                      <button
                        type="button"
                        className="relative rounded-full bg-[#485769] p-1 text-gray-300 hover:text-white focus:outline-none"
                      >
                        <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      {/* Cart button */}
                      <button
                        type="button"
                        className="relative ml-3 rounded-full bg-[#485769] p-1 text-gray-300 hover:text-white focus:outline-none"
                      >
                        <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-[#485769] text-sm text-white focus:outline-none">
                            <span className="sr-only">Open user menu</span>
                            <UserIcon className="h-8 w-8 rounded-full p-1" />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a
                                    href={item.href}
                                    className={classNames(
                                      active ? 'bg-gray-100' : '',
                                      'block px-4 py-2 text-sm text-gray-700'
                                    )}
                                  >
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-[#485769] p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? 'bg-[#485769] text-white'
                          : 'text-gray-300 hover:bg-[#485769] hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="border-t border-gray-700 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <UserIcon className="h-8 w-8 rounded-full bg-[#485769] p-1 text-white" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">User Name</div>
                      <div className="text-sm font-medium text-gray-400">user@example.com</div>
                    </div>
                    <button
                      type="button"
                      className="relative ml-auto flex-shrink-0 rounded-full bg-[#485769] p-1 text-gray-300 hover:text-white focus:outline-none"
                    >
                      <span className="sr-only">View notifications</span>
                      <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-[#485769] hover:text-white"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        {/* Secondary Navigation */}
        <div className="bg-[#37475a] text-white">
          <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
            <div className="flex h-10 items-center space-x-4 text-sm">
              <a href="#" className="hover:text-gray-300">Today's Deals</a>
              <a href="#" className="hover:text-gray-300">Customer Service</a>
              <a href="#" className="hover:text-gray-300">Registry</a>
              <a href="#" className="hover:text-gray-300">Gift Cards</a>
              <a href="#" className="hover:text-gray-300">Sell</a>
            </div>
          </div>
        </div>

        <main>{children}</main>

        {/* Amazon-style Footer */}
        <footer className="bg-[#232f3e] text-white">
          <div className="mx-auto max-w-[1500px] px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Footer Section 1 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Get to Know Us</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Careers</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Press Releases</a></li>
                </ul>
              </div>

              {/* Footer Section 2 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Make Money with Us</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-white">Sell products</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Advertise Your Products</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Become an Affiliate</a></li>
                </ul>
              </div>

              {/* Footer Section 3 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Payment Products</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-white">Business Card</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Shop with Points</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Reload Your Balance</a></li>
                </ul>
              </div>

              {/* Footer Section 4 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Let Us Help You</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-white">Your Account</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Your Orders</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Help</a></li>
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-700 pt-8">
              <p className="text-center text-gray-400">&copy; 2025 Trademark Search. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
