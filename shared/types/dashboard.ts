export interface DashboardKpis {
	activeOrders: number
	pendingRfps: number
	openEnquiries: number
	estimatesInReview: number
	projectedExpenditureCents: number
	supplyChainHealthPct: number
}

export interface DashboardActionItem {
	id: string
	priority: "high" | "medium" | "low"
	title: string
	detail: string
	dueLabel: string
	linkTo: string | null
}

export interface DashboardRecentActivity {
	id: string
	label: string
	detail: string
	timestamp: string
	icon: string
}

export interface DashboardStats {
	kpis: DashboardKpis
	criticalActions: DashboardActionItem[]
	recentActivity: DashboardRecentActivity[]
}
