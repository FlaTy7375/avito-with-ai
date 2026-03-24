import { Pagination } from "@mantine/core";
import { setCurrentPage } from "../filter-ads/model/slice";
import { useAppDispatch, useAppSelector } from "../../shared/lib/hooks";
import type { AdsResponse } from "../../entities/ad/types";
import styles from "./Pagination.module.css";

const ArrowIcon = ({ direction }: { direction: 'left' | 'right' }) => (
    <svg style={{ transform: direction === 'left' ? 'rotate(-180deg)' : 'rotate(0deg)' }} width="7" height="11" viewBox="0 0 7 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.21027 4.7385L0.172769 0.0228723C0.156993 0.0104521 0.138033 0.00273343 0.118068 0.000602754C0.0981026 -0.00152792 0.0779412 0.0020158 0.0598992 0.010827C0.0418571 0.0196383 0.0266664 0.0333596 0.0160712 0.0504152C0.00547591 0.0674708 -9.40343e-05 0.087169 1.20111e-06 0.107247V1.14252C1.20111e-06 1.20814 0.0308049 1.27109 0.0816977 1.31127L4.90313 5.076L0.0816977 8.84073C0.0294656 8.88091 1.20111e-06 8.94385 1.20111e-06 9.00948V10.0447C1.20111e-06 10.1345 0.103126 10.184 0.172769 10.1291L6.21027 5.4135C6.26158 5.37347 6.3031 5.32227 6.33165 5.26378C6.3602 5.2053 6.37504 5.14108 6.37504 5.076C6.37504 5.01092 6.3602 4.94669 6.33165 4.88821C6.3031 4.82973 6.26158 4.77853 6.21027 4.7385Z" fill="black" fill-opacity="0.85"/>
    </svg>
)

export const PaginationAds = ({ data }: { data: AdsResponse | undefined }) => {
    const dispatch = useAppDispatch();
    const { currentPage } = useAppSelector(state => state.filter);

    return (
        <Pagination
            total={Math.ceil((data?.total ?? 0) / 10)}
            value={currentPage}
            onChange={(page) => dispatch(setCurrentPage(page))}
            radius="md"
            classNames={{ control: styles.control }}
            previousIcon={() => <ArrowIcon direction="left" />}
            nextIcon={() => <ArrowIcon direction="right" />}
            styles={{
                control: {
                    '--pagination-active-bg': 'rgba(255, 255, 255, 1)',
                    '--pagination-active-color': 'rgba(24, 144, 255, 1)',
                }
            }}
        />
    )
}