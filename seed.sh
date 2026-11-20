#!/usr/bin/env bash
# ============================================================================
# seed.sh — наполнение микросервиса демонстрационными мероприятиями и
# результатами. Запускается ПОСЛЕ `docker compose up -d`.
#
# Преподаватель может запустить этот скрипт, чтобы на главной странице и
# в календаре сразу появились реальные данные (а не пустое состояние).
#
# Использование:
#   cd tfso-mvp
#   docker compose up -d
#   ./seed.sh
# ============================================================================
set -euo pipefail

API="http://localhost:4000"

echo "Проверка доступности микросервиса…"
if ! curl -fsS "${API}/health" >/dev/null 2>&1; then
  echo "❌ Микросервис не отвечает на ${API}."
  echo "   Сначала запустите стек: docker compose up -d --build"
  exit 1
fi
echo "✓ Микросервис доступен"
echo

# ---------- 1. Создаём 6 мероприятий ----------
echo "Создаём мероприятия…"

declare -a EVENT_IDS

create_event() {
  local title="$1" date="$2" location="$3" discipline="$4" status="$5" description="$6"
  local id
  id=$(curl -fsS -X POST "${API}/api/events" \
    -H "Content-Type: application/json" \
    -d "$(jq -nc \
      --arg t "$title" --arg d "$date" --arg l "$location" \
      --arg disc "$discipline" --arg s "$status" --arg desc "$description" \
      '{title:$t, eventDate:$d, location:$l, discipline:$disc, status:$s, description:$desc}')")
  echo "$id" | jq -r '.id'
}

EVENT_IDS+=("$(create_event \
  "Открытие зимнего сезона 2026" \
  "2026-12-05" \
  "Лагерный сад, Томск" \
  "Спринт" \
  "upcoming" \
  "Традиционное открытие зимнего сезона: короткая дистанция в городском лесу, подходит для новичков.")")

EVENT_IDS+=("$(create_event \
  "Чемпионат области «Снежный азимут»" \
  "2026-12-20" \
  "Басандайка" \
  "Классика" \
  "upcoming" \
  "Главный старт зимы: длинная дистанция, сложный рельеф, отбор на регион. Приём заявок на orgeo.ru.")")

EVENT_IDS+=("$(create_event \
  "Новогодний спринт-турнир" \
  "2027-01-07" \
  "Михайловская роща" \
  "Ночь" \
  "upcoming" \
  "Праздничный ночной старт с фонарём. Обязательна световозвращающая одежда.")")

EVENT_IDS+=("$(create_event \
  "Кубок Сибири 2027 — 1 этап" \
  "2027-02-15" \
  "Академгородок, Томск" \
  "Эстафета" \
  "upcoming" \
  "Командная эстафета 3×3 км среди клубов Сибири. Регистрация команд через сайт федерации.")")

EVENT_IDS+=("$(create_event \
  "Парковый тур — 6 этап" \
  "2026-10-11" \
  "Университетская роща" \
  "Парк" \
  "finished" \
  "Шестой этап паркового тура собрал рекордные 214 участников.")")

EVENT_IDS+=("$(create_event \
  "Кубок Томска — 4 этап" \
  "2026-09-27" \
  "Сосновый бор" \
  "Классика" \
  "finished" \
  "Четвёртый этап Кубка Томска. Тёплая осенняя погода, быстрая дистанция.")")

echo "✓ Создано мероприятий: ${#EVENT_IDS[@]}"
echo

# ---------- 2. Добавляем результаты к завершённому событию (5-е в массиве) ----------
# Индекс 4 — это «Парковый тур — 6 этап» (finished)
FINISHED_EVENT_ID="${EVENT_IDS[4]}"
echo "Добавляем результаты к «Парковый тур — 6 этап» (${FINISHED_EVENT_ID})…"

add_result() {
  local eid="$1" name="$2" team="$3" year="$4" time="$5" status="$6"
  curl -fsS -X POST "${API}/api/events/${eid}/results" \
    -H "Content-Type: application/json" \
    -d "$(jq -nc \
      --arg n "$name" --arg t "$team" --argjson y "$year" \
      --argjson time "$time" --arg s "$status" \
      '{athleteName:$n, team:$t, birthYear:$y, timeSeconds:$time, status:$s}')" \
    >/dev/null
}

# OK с разным временем — проверка распределения мест
add_result "$FINISHED_EVENT_ID" "Петров Алексей"  "Азимут-ТПУ"  1998  1755  OK
add_result "$FINISHED_EVENT_ID" "Иванов Дмитрий"  "Кедр"        2001  1830  OK
add_result "$FINISHED_EVENT_ID" "Смирнова Анна"   "ТГУ-Ориент"  1995  1912  OK
add_result "$FINISHED_EVENT_ID" "Кузнецов Иван"    "Азимут-ТПУ"  2002  1968  OK
add_result "$FINISHED_EVENT_ID" "Соколова Мария"  "Северный ветер" 1999  2050  OK
add_result "$FINISHED_EVENT_ID" "Орлов Сергей"    "Лесная тропа" 1988  2147  OK

# Нештатные — для демонстрации статусов SportOrg
add_result "$FINISHED_EVENT_ID" "Волков Андрей"   "Кедр"        1990  0     DNF
add_result "$FINISHED_EVENT_ID" "Зайцева Ольга"   "ТГУ-Ориент"  2003  0     DSQ
add_result "$FINISHED_EVENT_ID" "Морозов Павел"   "Маршрут 70"  1978  0     DNS
add_result "$FINISHED_EVENT_ID" "Лебедев Артём"   "Азимут-ТПУ"  2000  0     OTL

echo "✓ Добавлено 10 результатов (6 финишировавших + 4 нештатных)"
echo

# ---------- 3. Добавляем результаты ко второму завершённому событию ----------
FINISHED_2_ID="${EVENT_IDS[5]}"
echo "Добавляем результаты к «Кубок Томска — 4 этап» (${FINISHED_2_ID})…"

add_result "$FINISHED_2_ID" "Никитин Роман"     "Азимут-ТПУ"     1992  2410  OK
add_result "$FINISHED_2_ID" "Григорьева Елена"  "Северный ветер" 1996  2530  OK
add_result "$FINISHED_2_ID" "Фёдоров Михаил"    "Кедр"           1985  2645  OK
add_result "$FINISHED_2_ID" "Алексеева Дарья"  "ТГУ-Ориент"     2004  2720  OK

echo "✓ Добавлено 4 результата"
echo

echo "🎉 Готово! Теперь на сайте http://localhost:3000 есть:"
echo "   • 4 предстоящих мероприятия (на главной и в календаре)"
echo "   • 2 завершённых мероприятия с протоколами результатов"
echo "   • Распределение мест (1..N) и нештатные статусы DNF/DSQ/DNS/OTL"
