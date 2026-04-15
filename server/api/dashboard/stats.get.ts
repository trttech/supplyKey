import type { DashboardStats } from "#shared/types/dashboard"
import { enquiriesRepo, ordersRepo } from "~~/server/utils/db"
import { requireSessionUser } from "~~/server/utils/auth"

export default defineEventHandler(async (event): Promise<DashboardStats> => {
	const user = await requireSessionUser(event)

	const [activeOrders, openEnquiries, projectedExpenditureCents, recentOrders, enquiries] = await Promise.all([
		ordersRepo.countActiveForUser(user.id),
		enquiriesRepo.countOpenForUser(user.id),
		ordersRepo.sumProjectedExpenditureForUser(user.id),
		ordersRepo.recentForUser(user.id, 5),
		enquiriesRepo.listForUser(user.id),
	])

	const criticalEnquiries = enquiries
		.filter(e => e.priority === "high" || e.priority === "urgent")
		.slice(0, 3)
		.map(e => ({
			id: `enq-${e.id}`,
			priority: (e.priority === "urgent" ? "high" : "medium") as "high" | "medium",
			title: e.subject,
			detail: `${e.supplier_name} · ${e.enquiry_number}`,
			dueLabel: "Awaiting supplier response",
			linkTo: `/enquiries/${e.enquiry_number}`,
		}))

	const criticalActions = [
		...criticalEnquiries,
		...(activeOrders > 0
			? [{
					id: "orders-review",
					priority: "medium" as const,
					title: "Active requisitions in transit",
					detail: `${activeOrders} order${activeOrders === 1 ? "" : "s"} awaiting delivery confirmation`,
					dueLabel: "Ongoing",
					linkTo: null,
				}]
			: []),
	]

	const recentActivity = [
		...recentOrders.map(order => ({
			id: `ord-${order.id}`,
			label: `Requisition ${order.order_number} placed`,
			detail: `$${(order.total_cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} · ${order.delivery_site}`,
			timestamp: new Date(order.placed_at).toISOString(),
			icon: "ShoppingCart",
		})),
		...enquiries.slice(0, 3).map((e) => {
			const ts = e.updated_at ?? e.created_at
			return {
				id: `act-enq-${e.id}`,
				label: `Enquiry ${e.enquiry_number}`,
				detail: `${e.supplier_name} · ${e.status}`,
				timestamp: new Date(ts).toISOString(),
				icon: "MessageCircle",
			}
		}),
	].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 6)

	// Static RFP + estimate counts — not backed by real tables for the MVP.
	const pendingRfps = 7
	const estimatesInReview = 3
	const supplyChainHealthPct = 98.4

	return {
		kpis: {
			activeOrders,
			pendingRfps,
			openEnquiries,
			estimatesInReview,
			projectedExpenditureCents,
			supplyChainHealthPct,
		},
		criticalActions,
		recentActivity,
	}
})
