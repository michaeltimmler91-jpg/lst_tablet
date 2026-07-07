local tabletOpen = false
local tabletObj = nil

local TABLET_ANIM_DICT = 'amb@world_human_seat_wall_tablet@female@base'
local TABLET_ANIM_NAME = 'base'
local TABLET_MODEL = 'prop_cs_tablet'

local function loadAnimDict(dict)
    RequestAnimDict(dict)

    while not HasAnimDictLoaded(dict) do
        Wait(10)
    end
end

local function loadModel(model)
    local hash = joaat(model)
    RequestModel(hash)

    while not HasModelLoaded(hash) do
        Wait(10)
    end

    return hash
end

local function showTaxiNotification(title, message)
    BeginTextCommandThefeedPost('STRING')
    AddTextComponentSubstringPlayerName(message or '')
    EndTextCommandThefeedPostMessagetext(
        'CHAR_TAXI',
        'CHAR_TAXI',
        false,
        4,
        title or 'Taxi',
        'Los Santos Taxi'
    )
    EndTextCommandThefeedPostTicker(false, false)
end

local function playTabletBing()
    PlaySoundFrontend(-1, 'TIMER_STOP', 'HUD_MINI_GAME_SOUNDSET', true)
end

local function startTabletAnim()
    local ped = PlayerPedId()

    loadAnimDict(TABLET_ANIM_DICT)

    TaskPlayAnim(
        ped,
        TABLET_ANIM_DICT,
        TABLET_ANIM_NAME,
        8.0,
        -8.0,
        -1,
        49,
        0.0,
        false,
        false,
        false
    )

    local model = loadModel(TABLET_MODEL)
    tabletObj = CreateObject(model, 0.0, 0.0, 0.0, true, true, false)

    AttachEntityToEntity(
        tabletObj,
        ped,
        GetPedBoneIndex(ped, 28422),
        0.0,
        0.0,
        0.03,
        0.0,
        0.0,
        0.0,
        true,
        true,
        false,
        true,
        1,
        true
    )

    SetModelAsNoLongerNeeded(model)
end

local function stopTabletAnim()
    local ped = PlayerPedId()

    ClearPedTasks(ped)

    if tabletObj and DoesEntityExist(tabletObj) then
        DeleteEntity(tabletObj)
    end

    tabletObj = nil
end

local function openTablet()
    if tabletOpen then return end

    tabletOpen = true
    startTabletAnim()

    SetNuiFocus(true, true)
    SetNuiFocusKeepInput(false)

    SendNUIMessage({
        action = 'open'
    })
end

local function closeTablet()
    if not tabletOpen then return end

    tabletOpen = false
    stopTabletAnim()

    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)

    SendNUIMessage({
        action = 'close'
    })
end

RegisterCommand('taxitablet', function()
    if tabletOpen then
        closeTablet()
    else
        openTablet()
    end
end, false)

RegisterNUICallback('close', function(_, cb)
    closeTablet()
    cb('ok')
end)

RegisterNUICallback('taxiNewJobAlert', function(data, cb)
    playTabletBing()

    local rideType = data and data.rideType or 'Neuer Auftrag'
    local pickup = data and data.pickup or 'Unbekannt'

    showTaxiNotification(
        'Taxi',
        ('Neuer Auftrag: %s\nAbholung: %s'):format(rideType, pickup)
    )

    cb('ok')
end)

RegisterNUICallback('taxiIdleWarning', function(_, cb)
    playTabletBing()

    showTaxiNotification(
        'Taxi',
        'Deine Sitzung läuft in 2 Minuten ab.\nÖffne das Tablet, um angemeldet zu bleiben.'
    )

    cb('ok')
end)

AddEventHandler('onResourceStop', function(resourceName)
    if resourceName ~= GetCurrentResourceName() then return end

    stopTabletAnim()
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)
end)
