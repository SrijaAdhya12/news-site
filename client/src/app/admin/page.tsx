import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import db from '@/db'
import { formatCurrency, formatNumber } from '@/lib'
const getSalesData = async () => {
	const data = await db.order.aggregate({
		_sum: {
			pricePaidInCents: true
		},
		_count: true
	})
	return {
		amount: (data._sum.pricePaidInCents || 0) / 100,
		numberOfSales: data._count
	}
}

const getUserData = async () => {
	const [userCount, orderData] = await Promise.all([
		db.user.count(),
		db.order.aggregate({
			_sum: {
				pricePaidInCents: true
			}
		})
	])
	return {
		userCount,
		averageValuePerUser: userCount === 0 ? 0 : (orderData._sum.pricePaidInCents || 0) / userCount / 100
	}
}

const getProductData = async () => {
	const [activeCount, inactiveCount] = await Promise.all([
		db.product.count({ where: { isAvailableForPurchase: true } }),
		db.product.count({ where: { isAvailableForPurchase: false } })
	])
	return {
		activeCount,
		inactiveCount
	}
}

const AdminDashboard = async () => {
	const [salesData, userData, productData] = await Promise.all([getSalesData(), getUserData(), getProductData()])

	return (
		<main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 container mx-auto my-6">
			<DashboardCard
				title="Sales"
				subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
				body={formatCurrency(salesData.amount)}
			/>
			<DashboardCard
				title="Customers"
				subtitle={`${formatCurrency(userData.averageValuePerUser)} Average Value`}
				body={formatNumber(userData.userCount)}
			/>
			<DashboardCard
				title="Active Products"
				subtitle={`${formatNumber(productData.inactiveCount)} Inactive`}
				body={formatNumber(productData.activeCount)}
			/>
		</main>
	)
}

type DashboardCardProps = {
	title: string
	subtitle: string
	body: string
}

const DashboardCard = ({ title, subtitle, body }: DashboardCardProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{subtitle}</CardDescription>
			</CardHeader>
			<CardContent>
				<p>{body}</p>
			</CardContent>
		</Card>
	)
}

export default AdminDashboard
