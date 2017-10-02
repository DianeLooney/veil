interface ISubscription {
  event: string
  filters?: string[]
}
export { ISubscription }
interface INotifyFunc {
  (event: string, data: any): void
}
export { INotifyFunc }
interface IMetric {
  slug: string
  subscriptions: ISubscription[]
  notify: INotifyFunc
  summary: { (): any }
}
export { IMetric }
