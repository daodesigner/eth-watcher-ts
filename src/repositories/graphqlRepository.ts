import GraphqlClient from '../graphqlClient';

export default class GraphqlRepository {

	private static repository: GraphqlRepository;

	private graphqlClient: GraphqlClient;

	public static getRepository(): GraphqlRepository {
		if (!GraphqlRepository.repository) {
			GraphqlRepository.repository = new GraphqlRepository();
		}

		return GraphqlRepository.repository;
	}
	
	public constructor() {
		this.graphqlClient = new GraphqlClient();
	}

	public ethHeaderCidByBlockNumber(blockNumber: string | number): Promise<unknown> {
		return this.graphqlClient.query(`
			query MyQuery {
				ethHeaderCidByBlockNumber(n: "${blockNumber}") {
					nodes {
						ethTransactionCidsByHeaderId {
							nodes {
								receiptCidByTxId {
									id
									mhKey
									logContracts
									nodeId
									topic0S
									topic1S
									topic2S
									topic3S
									txId
									cid
									contract
									blockByMhKey {
										data
									}
									ethTransactionCidByTxId {
										ethHeaderCidByHeaderId {
											blockNumber
										}
									}
								}
							}
						}
					}
				}
			}
		`);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public subscriptionReceiptCids(onNext: (value: any) => void): Promise<void> {
		return this.graphqlClient.subscribe(`
			subscription MySubscription {
				listen(topic: "receipt_cids") {
					relatedNode {
					... on ReceiptCid {
						id
						mhKey
						logContracts
						nodeId
						topic0S
						topic1S
						topic2S
						topic3S
						txId
						cid
						contract
						blockByMhKey {
							data
						}
						ethTransactionCidByTxId {
							ethHeaderCidByHeaderId {
								blockNumber
							}
						}
					}
					}
				}
			}
		`, onNext);
	}
}