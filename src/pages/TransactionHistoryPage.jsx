import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/auth/AuthProvider';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './TransactionHistoryPage.css';

const TransactionHistoryPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) {
        setError('로그인 후 거래내역을 확인할 수 있습니다.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const storedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
        // For a real app, you'd filter by user.id here
        setTransactions(storedTransactions);
      } catch (err) {
        setError('거래내역을 불러오는데 실패했습니다.');
        console.error('Failed to fetch transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="transaction-history-page error-message">{error}</div>;
  }

  return (
    <div className="transaction-history-page">
      <main className="transaction-history-main">
        <h1 className="page-title">거래내역</h1>

        {transactions.length === 0 ? (
          <p className="no-transactions-message">아직 거래내역이 없습니다.</p>
        ) : (
          <div className="transaction-list">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-header">
                  <span className="transaction-date">{transaction.date}</span>
                  <span className={`transaction-status status-${transaction.status.replace(' ', '')}`}>
                    {transaction.status}
                  </span>
                </div>
                <div className="transaction-details">
                  <span className="transaction-product-name">
                    {transaction.products && transaction.products.length > 0
                      ? (transaction.products.length > 1
                        ? `${transaction.products[0].name} 외 ${transaction.products.length - 1}개`
                        : transaction.products[0].name)
                      : '상품 정보 없음'}
                  </span>
                  <span className="transaction-amount">{transaction.amount.toLocaleString()}원</span>
                </div>
                <div className="transaction-footer">
                  <span className="transaction-id">주문번호: {transaction.id}</span>
                  <span className="transaction-payment-method">결제수단: {transaction.paymentMethod}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default TransactionHistoryPage;
