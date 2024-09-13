import { Nav, NavLink } from '@/components/Nav'

export const dynamic = "force-dynamic"

const CustomerLayout = ({children}: Readonly<{children: React.ReactNode}>) => {
	return (
		<>
			<Nav>
				<NavLink href="/">Home</NavLink>
				<NavLink href="/products">Products</NavLink>
				<NavLink href="/orders">My Orders</NavLink>
			</Nav>
			{children}
		</>
	)
}

export default CustomerLayout
