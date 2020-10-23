import React from 'react';
import { ExperienceType } from '../../../types/view-model';
import styles from './user-card-experience.module.scss';

interface UserCardExperiencePropTypes {
  data: ExperienceType;
}

export const UserCardExperience = (props: UserCardExperiencePropTypes) => {
  const { title, description, to_date_year, from_date_year } = props.data;
  return (
    <div className="row">
      <div className="col-3">
        {/* sample image, remove when using real data */}
        <img
          className={styles['experience-image']}
          src={`data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iM
          S4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsd
          XN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+
          CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvM
          Tk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MDUgNTA1I
          iBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MDUgNTA1OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjUxMnB4
          IiBoZWlnaHQ9IjUxMnB4Ij4KPGNpcmNsZSBzdHlsZT0iZmlsbDojMzI0QTVFOyIgY3g9IjI1Mi41IiBjeT0iMjUyLjUiIHI9IjI1M
          i41Ii8+Cjxwb2x5Z29uIHN0eWxlPSJmaWxsOiNDRUQ1RTA7IiBwb2ludHM9IjE0MywyMzUgMTMwLjUsMjI1LjQgMjEyLjQsMTE5LjIg
          MjkyLjIsMTk2LjQgMzY3LjksMTM1LjkgMzc3LjcsMTQ4LjIgMjkxLjIsMjE3LjQgICAyMTQuMSwxNDIuOCAiLz4KPHBhdGggc3R5bGU9
          ImZpbGw6IzJCM0I0RTsiIGQ9Ik00My40LDM5NC4xQzg4LjgsNDYxLDE2NS41LDUwNSwyNTIuNSw1MDVzMTYzLjctNDQsMjA5LjEtMTEwLj
          lINDMuNHoiLz4KPGc+Cgk8cGF0aCBzdHlsZT0iZmlsbDojNTRDMEVCOyIgZD0iTTM5NC44LDM4NS40aC00OS4zYy0xLjIsMC0yLjEtMC45L
          TIuMS0yLjFWMjA0LjZjMC0xLjIsMC45LTIuMSwyLjEtMi4xaDQ5LjNjMS4yLDAsMi4xLDAuOSwyLjEsMi4xICAgdjE3OC43QzM5Ni45LDM4
          NC40LDM5NiwzODUuNCwzOTQuOCwzODUuNHoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiM1NEMwRUI7IiBkPSJNMzE2LjQsMzg1LjRoLTQ5LjN
          jLTEuMiwwLTIuMS0wLjktMi4xLTIuMVYyNTcuMWMwLTEuMiwwLjktMi4xLDIuMS0yLjFoNDkuM2MxLjIsMCwyLjEsMC45LDIuMSwyLjEgIC
          B2MTI2LjJDMzE4LjQsMzg0LjQsMzE3LjUsMzg1LjQsMzE2LjQsMzg1LjR6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojNTRDMEVCOyIgZD0iT
          TIzNy45LDM4NS40aC00OS4zYy0xLjIsMC0yLjEtMC45LTIuMS0yLjFWMTkzLjJjMC0xLjIsMC45LTIuMSwyLjEtMi4xaDQ5LjNjMS4yLDAs
          Mi4xLDAuOSwyLjEsMi4xICAgdjE5MC4xQzI0MCwzODQuNCwyMzkuMSwzODUuNCwyMzcuOSwzODUuNHoiLz4KCTxwYXRoIHN0eWxlPSJmaWx
          sOiM1NEMwRUI7IiBkPSJNMTU5LjUsMzg1LjRoLTQ5LjNjLTEuMiwwLTIuMS0wLjktMi4xLTIuMXYtOTMuN2MwLTEuMiwwLjktMi4xLDIuMS
          0yLjFoNDkuM2MxLjIsMCwyLjEsMC45LDIuMSwyLjEgICB2OTMuN0MxNjEuNiwzODQuNCwxNjAuNiwzODUuNCwxNTkuNSwzODUuNHoiLz4KP
          C9nPgo8cmVjdCB4PSI3My4zIiB5PSIzNzciIHN0eWxlPSJmaWxsOiNDRUQ1RTA7IiB3aWR0aD0iMzU4LjQiIGhlaWdodD0iMTcuMSIvPgo8
          Y2lyY2xlIHN0eWxlPSJmaWxsOiNFNkU5RUU7IiBjeD0iMzcyLjgiIGN5PSIxNDIuMSIgcj0iMjkuNCIvPgo8Y2lyY2xlIHN0eWxlPSJmaWx
          sOiNGRjcwNTg7IiBjeD0iMzcyLjgiIGN5PSIxNDIuMSIgcj0iMTcuMSIvPgo8Y2lyY2xlIHN0eWxlPSJmaWxsOiNFNkU5RUU7IiBjeD0iMj
          kxLjciIGN5PSIyMDQiIHI9IjI5LjQiLz4KPGNpcmNsZSBzdHlsZT0iZmlsbDojRkY3MDU4OyIgY3g9IjI5MS43IiBjeT0iMjA0IiByPSIxN
          y4xIi8+CjxjaXJjbGUgc3R5bGU9ImZpbGw6I0U2RTlFRTsiIGN4PSIyMTMuMyIgY3k9IjEzMSIgcj0iMjkuNCIvPgo8Y2lyY2xlIHN0eWxl
          PSJmaWxsOiNGRjcwNTg7IiBjeD0iMjEzLjMiIGN5PSIxMzEiIHI9IjE3LjEiLz4KPGNpcmNsZSBzdHlsZT0iZmlsbDojRTZFOUVFOyIgY3g
          9IjEzNC44IiBjeT0iMjMwLjIiIHI9IjI5LjQiLz4KPGNpcmNsZSBzdHlsZT0iZmlsbDojRkY3MDU4OyIgY3g9IjEzNC44IiBjeT0iMjMwLj
          IiIHI9IjE3LjEiLz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+C
          jwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==`}
        />
      </div>
      <div className="col-9">
        <div className={styles['description-wrapper']}>
          <h5 className={styles['title']}>{title}</h5>
          <span className={styles['icon-wrapper']}>
            <i className={`${styles['edit-icon']} stack-down-open`} />
          </span>
        </div>

        <p className={styles['small-text']}>{description}</p>
        <p className={styles['small-text']}>{`${from_date_year} - ${to_date_year}`}</p>
      </div>
    </div>
  );
};
