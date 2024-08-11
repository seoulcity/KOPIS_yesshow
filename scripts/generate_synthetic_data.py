# scripts/generate_synthetic_data.py
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_synthetic_data(num_records=1000):
    start_date = datetime(2023, 1, 1)
    
    data = {
        'performance_day': [(start_date + timedelta(days=np.random.randint(0, 365))).strftime('%Y-%m-%d') for _ in range(num_records)],
        'day_of_week': np.random.choice(['월', '화', '수', '목', '금', '토', '일'], num_records),
        'performance_time': [f"{np.random.randint(10, 22):02d}:00" for _ in range(num_records)],
        'ticket_price': np.random.randint(100, 1001, num_records) * 100,  # 티켓 가격 마지막 두 자리를 00으로 설정
        'total_seats': np.random.randint(100, 1001, num_records),
        'buyer_gender': np.random.choice(['M', 'F'], num_records),
        'buyer_age_group': np.random.choice(['10대', '20대', '30대', '40대', '50대 이상'], num_records),
        'previous_purchases': np.random.randint(0, 11, num_records),
        'previous_cancellations': np.random.randint(0, 6, num_records),
    }

    df = pd.DataFrame(data)

    # 취소 및 노쇼 여부 통합
    df['attendance_status'] = np.select(
        [
            (df['previous_cancellations'] > df['previous_purchases'] / 2) | (np.random.rand(num_records) < 0.1),  # 취소 조건
            (np.random.rand(num_records) < 0.05)  # 노쇼 조건
        ],
        [
            0,  # 취소
            1   # 노쇼
        ],
        default=2  # 실제 관람 (취소 및 노쇼가 아닌 경우)
    )

    return df

# 데이터 생성 및 CSV 파일로 저장
synthetic_data = generate_synthetic_data(1000)
synthetic_data.to_csv('synthetic_performance_data.csv', index=False)
print("Synthetic data has been generated and saved to 'synthetic_performance_data.csv'")
